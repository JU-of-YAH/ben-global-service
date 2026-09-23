import {
  FormEvent,
  useEffect,
  useState,
  ChangeEvent,
} from 'react'

import {
  ArrowLeft,
  CarFront,
  Save,
  ImagePlus,
  X,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  createCar,
  getCars,
  updateCar,
  updateCarImages,
} from '../lib/cars'

import { uploadCarImage } from '../lib/storage'

type ExistingImage = {
  url: string
  existing: true
}

type NewImage = {
  url: string
  file: File
  existing: false
}

type ImageItem = ExistingImage | NewImage

export default function AdminCarForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditMode)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadProgress, setUploadProgress] = useState('')

  const [images, setImages] = useState<ImageItem[]>([])

  const [form, setForm] = useState({
    marque: '',
    modele: '',
    annee: '',
    prix: '',
    kilometrage: '',
    carburant: '',
    boite: '',
    carrosserie: '',
    places: '',
    couleur: '',
    ville: 'Abidjan',
    description: '',
    equipements: '',
    disponible: true,
  })

  function updateField(
    field: keyof typeof form,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  /*
   * CHARGEMENT DU VÉHICULE EN MODE MODIFICATION
   */

  useEffect(() => {
    if (!id) {
      return
    }

    async function loadCar() {
      try {
        setInitialLoading(true)
        setError('')

        const cars = await getCars()
        const car = cars.find((item) => item.id === id)

        if (!car) {
          setError('Véhicule introuvable.')
          return
        }

        setForm({
          marque: car.marque || '',
          modele: car.modele || '',
          annee: car.annee
            ? String(car.annee)
            : '',
          prix: car.prix
            ? String(car.prix)
            : '',
          kilometrage: car.kilometrage
            ? String(car.kilometrage)
            : '',
          carburant: car.carburant || '',
          boite: car.boite || '',
          carrosserie: car.carrosserie || '',
          places: car.places
            ? String(car.places)
            : '',
          couleur: car.couleur || '',
          ville: car.ville || 'Abidjan',
          description: car.description || '',
          equipements: car.equipements?.join(', ') || '',
          disponible: car.disponible,
        })

        setImages(
          (car.images || []).map((url) => ({
            url,
            existing: true,
          })),
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger le véhicule.',
        )
      } finally {
        setInitialLoading(false)
      }
    }

    loadCar()
  }, [id])

  /*
   * AJOUT DE PHOTOS
   */

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      event.target.files || [],
    )

    if (!files.length) {
      return
    }

    const validFiles: File[] = []
    const rejectedFiles: string[] = []

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        rejectedFiles.push(
          `${file.name} : format non accepté`,
        )
        return
      }

      if (file.size > 8 * 1024 * 1024) {
        rejectedFiles.push(
          `${file.name} : plus de 8 Mo`,
        )
        return
      }

      validFiles.push(file)
    })

    if (rejectedFiles.length > 0) {
      setError(
        `Certaines photos n'ont pas été ajoutées : ${rejectedFiles.join(', ')}`,
      )
    } else {
      setError('')
    }

    if (!validFiles.length) {
      event.target.value = ''
      return
    }

    const newImages: NewImage[] =
      validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        existing: false,
      }))

    setImages((current) => [
      ...current,
      ...newImages,
    ])

    event.target.value = ''
  }

  /*
   * SUPPRESSION D'UNE PHOTO
   */

  function removeImage(index: number) {
    setImages((current) => {
      const image = current[index]

      if (
        image &&
        image.existing === false
      ) {
        URL.revokeObjectURL(image.url)
      }

      return current.filter(
        (_, i) => i !== index,
      )
    })
  }

  /*
   * ENREGISTREMENT
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setUploadProgress('')

    if (
      !form.marque.trim() ||
      !form.modele.trim()
    ) {
      setError(
        'La marque et le modèle sont obligatoires.',
      )
      return
    }

    setLoading(true)

    try {
      const input = {
        marque: form.marque.trim(),
        modele: form.modele.trim(),

        annee: form.annee
          ? Number(form.annee)
          : null,

        prix: form.prix
          ? Number(form.prix)
          : null,

        kilometrage: form.kilometrage
          ? Number(form.kilometrage)
          : null,

        carburant:
          form.carburant || null,

        boite:
          form.boite || null,

        carrosserie:
          form.carrosserie || null,

        places: form.places
          ? Number(form.places)
          : null,

        couleur:
          form.couleur || null,

        ville: form.ville.trim(),

        description:
          form.description.trim(),

        equipements:
          form.equipements
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),

        disponible:
          form.disponible,
      }

      /*
       * AJOUT
       */

      if (!isEditMode) {
        const car = await createCar(input)

        const newImages = images.filter(
          (
            image,
          ): image is NewImage =>
            image.existing === false,
        )

        if (newImages.length > 0) {
          setUploadProgress(
            `Envoi de ${newImages.length} photo${
              newImages.length > 1
                ? 's'
                : ''
            }...`,
          )

          const imageUrls =
            await Promise.all(
              newImages.map((image) =>
                uploadCarImage(
                  image.file,
                  car.slug,
                ),
              ),
            )

          await updateCarImages(
            car.id,
            imageUrls,
          )
        }

        setUploadProgress('')

        setSuccess(
          `${car.marque} ${car.modele} a été ajouté avec succès.`,
        )

        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1000)

        return
      }

      /*
       * MODIFICATION
       */

      const updatedCar = await updateCar(
        id!,
        input,
      )

      const newImages = images.filter(
        (
          image,
        ): image is NewImage =>
          image.existing === false,
      )

      const existingImages = images
        .filter(
          (
            image,
          ): image is ExistingImage =>
            image.existing === true,
        )
        .map((image) => image.url)

      let finalImages = existingImages

      if (newImages.length > 0) {
        setUploadProgress(
          `Envoi de ${newImages.length} nouvelle${
            newImages.length > 1
              ? 's'
              : ''
          } photo${
            newImages.length > 1
              ? 's'
              : ''
          }...`,
        )

        const newImageUrls =
          await Promise.all(
            newImages.map((image) =>
              uploadCarImage(
                image.file,
                updatedCar.slug,
              ),
            ),
          )

        finalImages = [
          ...existingImages,
          ...newImageUrls,
        ]
      }

      await updateCarImages(
        updatedCar.id,
        finalImages,
      )

      setUploadProgress('')

      setSuccess(
        `${updatedCar.marque} ${updatedCar.modele} a été modifié avec succès.`,
      )

      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1000)
    } catch (err) {
      setUploadProgress('')

      setError(
        err instanceof Error
          ? err.message
          : isEditMode
            ? 'Impossible de modifier le véhicule.'
            : "Impossible d'ajouter le véhicule.",
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * CHARGEMENT INITIAL
   */

  if (initialLoading) {
    return (
      <main className="admin-page admin-loading">
        <p>
          Chargement du véhicule...
        </p>
      </main>
    )
  }

  return (
    <main className="admin-page admin-car-form-page">
      <div className="admin-form-container">

        <header className="admin-form-header">

          <button
            type="button"
            className="admin-back-button"
            onClick={() =>
              navigate('/admin/dashboard')
            }
          >
            <ArrowLeft size={17} />
            Retour au tableau de bord
          </button>

          <div>
            <span className="admin-eyebrow">
              INVENTAIRE
            </span>

            <h1>
              {isEditMode
                ? 'Modifier le véhicule'
                : 'Ajouter un véhicule'}
            </h1>

            <p>
              {isEditMode
                ? 'Modifiez les informations du véhicule dans l’inventaire BEN GLOBAL SERVICE.'
                : 'Enregistrez un nouveau véhicule dans l’inventaire BEN GLOBAL SERVICE.'}
            </p>
          </div>

        </header>

        <form
          className="admin-car-form"
          onSubmit={handleSubmit}
        >

          {/* INFORMATIONS PRINCIPALES */}

          <section className="admin-form-section">

            <div className="admin-form-section-title">
              <CarFront size={20} />

              <div>
                <h2>
                  Informations principales
                </h2>

                <p>
                  Les informations visibles dans
                  l’inventaire.
                </p>
              </div>
            </div>

            <div className="admin-form-grid">

              <label className="admin-field">
                <span>Marque *</span>

                <input
                  type="text"
                  value={form.marque}
                  onChange={(event) =>
                    updateField(
                      'marque',
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Toyota"
                  required
                />
              </label>

              <label className="admin-field">
                <span>Modèle *</span>

                <input
                  type="text"
                  value={form.modele}
                  onChange={(event) =>
                    updateField(
                      'modele',
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Land Cruiser"
                  required
                />
              </label>

              <label className="admin-field">
                <span>Année</span>

                <input
                  type="number"
                  value={form.annee}
                  onChange={(event) =>
                    updateField(
                      'annee',
                      event.target.value,
                    )
                  }
                  placeholder="2024"
                  min="1900"
                  max="2100"
                />
              </label>

              <label className="admin-field">
                <span>Prix (FCFA)</span>

                <input
                  type="number"
                  value={form.prix}
                  onChange={(event) =>
                    updateField(
                      'prix',
                      event.target.value,
                    )
                  }
                  placeholder="35000000"
                  min="0"
                />
              </label>

              <label className="admin-field">
                <span>Kilométrage</span>

                <input
                  type="number"
                  value={form.kilometrage}
                  onChange={(event) =>
                    updateField(
                      'kilometrage',
                      event.target.value,
                    )
                  }
                  placeholder="45000"
                  min="0"
                />
              </label>

              <label className="admin-field">
                <span>Ville</span>

                <input
                  type="text"
                  value={form.ville}
                  onChange={(event) =>
                    updateField(
                      'ville',
                      event.target.value,
                    )
                  }
                  placeholder="Abidjan"
                />
              </label>

            </div>
          </section>

          {/* CARACTÉRISTIQUES */}

          <section className="admin-form-section">

            <div className="admin-form-section-title">
              <CarFront size={20} />

              <div>
                <h2>
                  Caractéristiques
                </h2>

                <p>
                  Détails techniques du véhicule.
                </p>
              </div>
            </div>

            <div className="admin-form-grid">

              <label className="admin-field">
                <span>Carburant</span>

                <select
                  value={form.carburant}
                  onChange={(event) =>
                    updateField(
                      'carburant',
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Sélectionner
                  </option>

                  <option value="Essence">
                    Essence
                  </option>

                  <option value="Diesel">
                    Diesel
                  </option>

                  <option value="Hybride">
                    Hybride
                  </option>

                  <option value="Électrique">
                    Électrique
                  </option>
                </select>
              </label>

              <label className="admin-field">
                <span>
                  Boîte de vitesses
                </span>

                <select
                  value={form.boite}
                  onChange={(event) =>
                    updateField(
                      'boite',
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Sélectionner
                  </option>

                  <option value="Automatique">
                    Automatique
                  </option>

                  <option value="Manuelle">
                    Manuelle
                  </option>
                </select>
              </label>

              <label className="admin-field">
                <span>Carrosserie</span>

                <select
                  value={form.carrosserie}
                  onChange={(event) =>
                    updateField(
                      'carrosserie',
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Sélectionner
                  </option>

                  <option value="SUV">
                    SUV
                  </option>

                  <option value="Berline">
                    Berline
                  </option>

                  <option value="Coupé">
                    Coupé
                  </option>

                  <option value="Cabriolet">
                    Cabriolet
                  </option>

                  <option value="Pick-up">
                    Pick-up
                  </option>

                  <option value="Monospace">
                    Monospace
                  </option>

                  <option value="Break">
                    Break
                  </option>
                </select>
              </label>

              <label className="admin-field">
                <span>
                  Nombre de places
                </span>

                <input
                  type="number"
                  value={form.places}
                  onChange={(event) =>
                    updateField(
                      'places',
                      event.target.value,
                    )
                  }
                  placeholder="5"
                  min="1"
                  max="20"
                />
              </label>

              <label className="admin-field">
                <span>Couleur</span>

                <input
                  type="text"
                  value={form.couleur}
                  onChange={(event) =>
                    updateField(
                      'couleur',
                      event.target.value,
                    )
                  }
                  placeholder="Noir"
                />
              </label>

            </div>
          </section>

          {/* DESCRIPTION */}

          <section className="admin-form-section">

            <div className="admin-form-section-title">
              <CarFront size={20} />

              <div>
                <h2>
                  Description & équipements
                </h2>

                <p>
                  Présentez le véhicule aux clients.
                </p>
              </div>
            </div>

            <label className="admin-field">

              <span>Description</span>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    'description',
                    event.target.value,
                  )
                }
                placeholder="Décrivez le véhicule, son état, son historique..."
                rows={6}
              />

            </label>

            <label className="admin-field">

              <span>Équipements</span>

              <input
                type="text"
                value={form.equipements}
                onChange={(event) =>
                  updateField(
                    'equipements',
                    event.target.value,
                  )
                }
                placeholder="Climatisation, Cuir, GPS, Caméra de recul"
              />

              <small>
                Séparez les équipements par des
                virgules.
              </small>

            </label>

          </section>

          {/* PHOTOS */}

          <section className="admin-form-section">

            <div className="admin-form-section-title">

              <ImagePlus size={20} />

              <div>
                <h2>
                  Photos du véhicule
                </h2>

                <p>
                  Ajoutez les photos qui seront
                  affichées dans l’inventaire.
                </p>
              </div>

            </div>

            <label className="admin-image-upload">

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
              />

              <ImagePlus size={30} />

              <strong>
                Ajouter des photos
              </strong>

              <span>
                JPG, PNG ou WebP · 8 Mo maximum
                par image
              </span>

            </label>

            {images.length > 0 && (
              <div className="admin-image-grid">

                {images.map(
                  (image, index) => (
                    <div
                      className="admin-image-preview"
                      key={`${image.url}-${index}`}
                    >

                      <img
                        src={image.url}
                        alt={`Photo ${
                          index + 1
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        aria-label={`Supprimer la photo ${
                          index + 1
                        }`}
                      >
                        <X size={15} />
                      </button>

                      {index === 0 && (
                        <span className="admin-image-main">
                          Photo principale
                        </span>
                      )}

                    </div>
                  ),
                )}

              </div>
            )}

          </section>

          {/* DISPONIBILITÉ */}

          <section className="admin-form-section">

            <label className="admin-checkbox-field">

              <input
                type="checkbox"
                checked={form.disponible}
                onChange={(event) =>
                  updateField(
                    'disponible',
                    event.target.checked,
                  )
                }
              />

              <span>

                <strong>
                  Véhicule disponible
                </strong>

                <small>
                  Le véhicule sera visible dans
                  l’inventaire public.
                </small>

              </span>

            </label>

          </section>

          {uploadProgress && (
            <div className="admin-upload-progress">
              {uploadProgress}
            </div>
          )}

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {success && (
            <div className="admin-success">
              {success}
            </div>
          )}

          {/* ACTIONS */}

          <div className="admin-form-actions">

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() =>
                navigate('/admin/dashboard')
              }
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="admin-primary-button admin-submit-button"
              disabled={loading}
            >
              <Save size={18} />

              {loading
                ? 'Enregistrement...'
                : isEditMode
                  ? 'Enregistrer les modifications'
                  : 'Enregistrer le véhicule'}
            </button>

          </div>

        </form>
      </div>
    </main>
  )
}