import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Car } from '../lib/cars'
import { PageNavigation } from '../components/PageNavigation'

export function VehicleDetails() {
  const { slug } = useParams<{ slug: string }>()

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  /* =========================
     CHARGEMENT
  ========================= */

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

  /* =========================
     VÉHICULE INTROUVABLE
  ========================= */

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

  const image = car.images?.[0]

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
            GALERIE
        ========================= */}

        <div>
          {image ? (
            <img
              className="detail-image"
              src={image}
              alt={`${car.marque} ${car.modele}`}
            />
          ) : (
            <div className="detail-image-placeholder">
              <span>BEN GLOBAL SERVICE</span>
            </div>
          )}

          {car.images && car.images.length > 1 && (
            <div className="detail-gallery">
              {car.images.map(
                (imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`${car.marque} ${car.modele} - photo ${
                      index + 1
                    }`}
                  />
                ),
              )}
            </div>
          )}
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
    </section>
  )
}