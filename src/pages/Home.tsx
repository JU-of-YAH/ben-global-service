import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Handshake,
} from 'lucide-react'
import { SectionTitle } from '../components/SectionTitle'
import { VehicleCard } from '../components/VehicleCard'
import { getAvailableCars, type Car } from '../lib/cars'

export function Home() {
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)

  useEffect(() => {
    async function loadFeaturedVehicles() {
      try {
        const data = await getAvailableCars()

        // Les 3 véhicules les plus récemment ajoutés
        setVehicles(data.slice(0, 3))
      } catch (error) {
        console.error(
          'Impossible de charger les véhicules de la sélection :',
          error,
        )
      } finally {
        setLoadingVehicles(false)
      }
    }

    loadFeaturedVehicles()
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="eyebrow">
            BEN GLOBAL SERVICE · ABIDJAN
          </span>

          <h1>
            L'automobile, avec une exigence différente.
          </h1>

          <p>
            Découvrez une sélection de véhicules et un accompagnement
            pensé pour vous faire acheter, vendre et choisir avec confiance.
          </p>

          <div className="hero-actions">
            <Link
              className="btn btn-primary"
              to="/vehicules"
            >
              Découvrir nos véhicules
              <ArrowRight size={18} />
            </Link>

            <Link
              className="btn btn-ghost"
              to="/contact"
            >
              Parler à un conseiller
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionTitle
          eyebrow="Notre sélection"
          title="Des véhicules choisis avec attention"
          text="Une présentation claire, des informations essentielles et un accompagnement humain à chaque étape."
        />

        {loadingVehicles ? (
          <div className="empty">
            Chargement de notre sélection...
          </div>
        ) : vehicles.length > 0 ? (
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                car={vehicle}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            Aucun véhicule disponible pour le moment.
          </div>
        )}

        <div className="center">
          <Link
            className="text-link"
            to="/vehicules"
          >
            Voir tout l'inventaire →
          </Link>
        </div>
      </section>

      <section className="section dark-section">
        <SectionTitle
          eyebrow="Pourquoi nous"
          title="Un service pensé autour de la confiance"
        />

        <div className="feature-grid">
          <div className="feature">
            <ShieldCheck />
            <h3>Sélection</h3>
            <p>
              Des critères précis de qualité et de présentation.
            </p>
          </div>

          <div className="feature">
            <Search />
            <h3>Transparence</h3>
            <p>
              Les informations importantes sont présentées simplement.
            </p>
          </div>

          <div className="feature">
            <Handshake />
            <h3>Accompagnement</h3>
            <p>
              Une équipe disponible à chaque étape du projet.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">
            BEN GLOBAL SERVICE
          </span>

          <h2>
            Vous avez un projet automobile ?
          </h2>

          <p>
            Parlez-nous de votre besoin.
          </p>
        </div>

        <Link
          className="btn btn-primary"
          to="/contact"
        >
          Nous contacter
          <ArrowRight size={18} />
        </Link>
      </section>
    </>
  )
}