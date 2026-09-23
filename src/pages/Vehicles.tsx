import { useEffect, useState } from 'react'
import { SectionTitle } from '../components/SectionTitle'
import { PageNavigation } from '../components/PageNavigation'
import { VehicleCard } from '../components/VehicleCard'
import { getAvailableCars, type Car } from '../lib/cars'

export function Vehicles() {
  const [q, setQ] = useState('')
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true)
        setError('')

        const data = await getAvailableCars()
        setVehicles(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger les véhicules.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  const filtered = vehicles.filter((vehicle) =>
    `${vehicle.marque} ${vehicle.modele} ${vehicle.carrosserie || ''}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  )

  return (
    <section className="page section">
      <PageNavigation
        backTo="/"
        backLabel="Accueil"
        nextTo="/vendre"
        nextLabel="Vendre votre véhicule"
      />

      <SectionTitle
        eyebrow="Inventaire"
        title="Nos véhicules"
        text="Explorez notre sélection de véhicules disponibles."
      />

      <div className="searchbar">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Rechercher une marque, un modèle..."
        />
      </div>

      {loading ? (
        <div className="empty">
          Chargement des véhicules...
        </div>
      ) : error ? (
        <div className="empty">
          {error}
        </div>
      ) : (
        <>
          <div className="vehicle-grid">
            {filtered.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                car={vehicle}
              />
            ))}
          </div>

          {!filtered.length && (
            <div className="empty">
              {vehicles.length === 0
                ? 'Aucun véhicule disponible pour le moment.'
                : 'Aucun véhicule trouvé.'}
            </div>
          )}
        </>
      )}
    </section>
  )
}