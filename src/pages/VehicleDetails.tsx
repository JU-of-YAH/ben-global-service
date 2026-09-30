import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Car } from '../lib/cars'
import { PageNavigation } from '../components/PageNavigation'

export function VehicleDetails() {
  const { slug } = useParams<{ slug: string }>()

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================
  // DIAPORAMA
  // =========================

  const [currentImage, setCurrentImage] = useState(0)

  // =========================
  // PLEIN ÉCRAN
  // =========================

  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    async function loadVehicle() {
      if (!slug) {
        setError('Véhicule introuvable.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const { data, error: supabaseError } = await supabase
          .from('cars')
          .select('*')
          .eq('slug', slug)
          .eq('disponible', true)
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        setCar(data as Car)
        setCurrentImage(0)
      } catch (err) {
        setCar(null)
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger le véhicule.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [slug])

  // =========================
  // CHANGEMENT IMAGE
  // =========================

  function nextImage() {
    if (!car?.images?.length) return

    setCurrentImage((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1,
    )
  }

  function previousImage() {
    if (!car?.images?.length) return

    setCurrentImage((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1,
    )
  }

  // =========================
  // CLAVIER
  // =========================

  useEffect(() => {
    if (!lightboxOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLightboxOpen(false)
      }

      if (event.key === 'ArrowRight') {
        nextImage()
      }

      if (event.key === 'ArrowLeft') {
        previousImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxOpen, car])

  // =========================
  // CHARGEMENT
  // =========================

  if (loading) {
    return (
      <section className="section page">
        <PageNavigation
          backTo="/vehicules"
          backLabel="Tous les véhicules"
        />

        <div className="empty">
          Chargement du véhicule...
        </div>
      </section>
    )
  }

  // =========================
  // VÉHICULE INTROUVABLE
  // =========================

  if (!car) {
    return (
      <section className="section page">
        <PageNavigation
          backTo="/vehicules"
          backLabel="Tous les véhicules"
          nextTo="/contact"
          nextLabel="Nous contacter"
        />

        <h1>Véhicule introuvable</h1>

        {error && <p>{error}</p>}

        <Link
          className="text-link"
          to="/vehicules"
        >
          Retour aux véhicules
        </Link>
      </section>
    )
  }

  const images = car.images?.filter(Boolean) ?? []
  const image = images[currentImage]

  return (
    <section className="section page">

      {/* =========================
          NAVIGATION
      ========================= */}

      <PageNavigation
        backTo="/vehicules"
        backLabel="Tous les véhicules"
        nextTo="/contact"
        nextLabel="Nous contacter"
      />

      {/* =========================
          CONTENU DU VÉHICULE
      ========================= */}

      <div className="detail-grid">

        {/* =========================
            DIAPORAMA
        ========================= */}

        <div className="vehicle-slideshow">

          {image ? (
            <div
              className="vehicle-slideshow-main"
              onClick={() => setLightboxOpen(true)}
            >

              <img
                src={image}
                alt={`${car.marque} ${car.modele} - photo ${
                  currentImage + 1
                }`}
                className="vehicle-slideshow-image"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="vehicle-slide-button vehicle-slide-prev"
                    onClick={(event) => {
                      event.stopPropagation()
                      previousImage()
                    }}
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    className="vehicle-slide-button vehicle-slide-next"
                    onClick={(event) => {
                      event.stopPropagation()
                      nextImage()
                    }}
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="vehicle-slide-counter">
                {currentImage + 1} / {images.length}
              </div>

            </div>
          ) : (
            <div className="detail-image-placeholder">
              <span>BEN GLOBAL SERVICE</span>
            </div>
          )}

          {/* =========================
              INDICATEURS
          ========================= */}

          {images.length > 1 && (
            <div className="vehicle-slide-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    index === currentImage
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setCurrentImage(index)
                  }
                  aria-label={`Afficher la photo ${
                    index + 1
                  }`}
                />
              ))}
            </div>
          )}

          <p className="vehicle-gallery-hint">
            Cliquez sur l'image pour l'agrandir
          </p>

        </div>

        {/* =========================
            INFORMATIONS
        ========================= */}

        <div className="detail-content">

          <span className="eyebrow">
            {car.marque}
          </span>

          <h1>{car.modele}</h1>

          {/* PRIX */}

          <div className="detail-price">
            {car.prix !== null
              ? `${car.prix.toLocaleString(
                  'fr-FR',
                )} FCFA`
              : 'Prix sur demande'}
          </div>

          {/* =========================
              CARACTÉRISTIQUES
          ========================= */}

          <div className="spec-grid">

            <div>
              <small>Année</small>
              <strong>
                {car.annee ?? '—'}
              </strong>
            </div>

            <div>
              <small>Kilométrage</small>
              <strong>
                {car.kilometrage !== null
                  ? `${car.kilometrage.toLocaleString(
                      'fr-FR',
                    )} km`
                  : '—'}
              </strong>
            </div>

            <div>
              <small>Carburant</small>
              <strong>
                {car.carburant || '—'}
              </strong>
            </div>

            <div>
              <small>Boîte</small>
              <strong>
                {car.boite || '—'}
              </strong>
            </div>

            <div>
              <small>Carrosserie</small>
              <strong>
                {car.carrosserie || '—'}
              </strong>
            </div>

            <div>
              <small>Ville</small>
              <strong>
                {car.ville || '—'}
              </strong>
            </div>

            <div>
              <small>Places</small>
              <strong>
                {car.places ?? '—'}
              </strong>
            </div>

            <div>
              <small>Couleur</small>
              <strong>
                {car.couleur || '—'}
              </strong>
            </div>

          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}

          {car.description && (
            <div className="detail-description">
              <h2>Description</h2>

              <p>{car.description}</p>
            </div>
          )}

          {/* =========================
              ÉQUIPEMENTS
          ========================= */}

          {car.equipements?.length > 0 && (
            <div className="detail-equipment">
              <h2>Équipements</h2>

              <ul className="checks">
                {car.equipements.map(
                  (equipment) => (
                    <li key={equipment}>
                      <Check size={18} />
                      {equipment}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {/* =========================
              ENGAGEMENTS
          ========================= */}

          <ul className="checks">

            <li>
              <Check size={18} />
              Informations détaillées du véhicule
            </li>

            <li>
              <Check size={18} />
              Demande d'information rapide
            </li>

            <li>
              <Check size={18} />
              Accompagnement BEN GLOBAL SERVICE
            </li>

          </ul>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="detail-actions">

            <Link
              className="btn btn-primary"
              to={`/contact?type=test_drive&car=${encodeURIComponent(
                car.slug,
              )}`}
            >
              Demander une visite
            </Link>

            <Link
              className="btn btn-secondary"
              to={`/contact?type=contact&car=${encodeURIComponent(
                car.slug,
              )}`}
            >
              Demander des informations
            </Link>

          </div>

        </div>
      </div>

      {/* =========================
          VISIONNEUSE PLEIN ÉCRAN
      ========================= */}

      {lightboxOpen && image && (
        <div
          className="vehicle-lightbox"
          onClick={() => setLightboxOpen(false)}
        >

          <button
            type="button"
            className="vehicle-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="vehicle-lightbox-button vehicle-lightbox-prev"
              onClick={(event) => {
                event.stopPropagation()
                previousImage()
              }}
              aria-label="Image précédente"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <img
            src={image}
            alt={`${car.marque} ${car.modele} - photo ${
              currentImage + 1
            }`}
            className="vehicle-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              className="vehicle-lightbox-button vehicle-lightbox-next"
              onClick={(event) => {
                event.stopPropagation()
                nextImage()
              }}
              aria-label="Image suivante"
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div className="vehicle-lightbox-counter">
            {currentImage + 1} / {images.length}
          </div>

        </div>
      )}

    </section>
  )
}