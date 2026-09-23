import { Link } from 'react-router-dom'
import type { Car } from '../lib/cars'

type VehicleCardProps = {
  car: Car
}

export function VehicleCard({ car }: VehicleCardProps) {
  const image = car.images?.[0]

  return (
    <article className="vehicle-card">
      <Link
        to={`/vehicules/${car.slug}`}
        className="vehicle-image-wrap"
      >
        {image ? (
          <img
            src={image}
            alt={`${car.marque} ${car.modele}`}
          />
        ) : (
          <div className="vehicle-image-placeholder">
            <span>BEN GLOBAL SERVICE</span>
          </div>
        )}

        {car.annee && (
          <span className="vehicle-badge">
            {car.annee}
          </span>
        )}
      </Link>

      <div className="vehicle-info">
        <span className="eyebrow">
          {car.marque}
        </span>

        <h3>{car.modele}</h3>

        <div className="vehicle-meta">
          {car.kilometrage !== null && (
            <span>
              {car.kilometrage.toLocaleString('fr-FR')} km
            </span>
          )}

          {car.carburant && (
            <span>{car.carburant}</span>
          )}

          {car.boite && (
            <span>{car.boite}</span>
          )}
        </div>

        <div className="vehicle-price">
          {car.prix !== null
            ? `${car.prix.toLocaleString('fr-FR')} FCFA`
            : 'Prix sur demande'}
        </div>

        <Link
          className="text-link"
          to={`/vehicules/${car.slug}`}
        >
          Voir le véhicule →
        </Link>
      </div>
    </article>
  )
}