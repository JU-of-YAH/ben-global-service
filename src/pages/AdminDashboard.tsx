import { useEffect, useState } from 'react'
import {
  CarFront,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCurrentAdmin, signOutAdmin } from '../lib/auth'
import {
  deleteCar,
  getCars,
  type Car,
} from '../lib/cars'
import {
  deleteLead,
  getLeads,
  type Lead,
} from '../lib/leads'

type AdminData = Awaited<ReturnType<typeof getCurrentAdmin>>

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [admin, setAdmin] = useState<AdminData>(null)
  const [cars, setCars] = useState<Car[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
const [leadsLoading, setLeadsLoading] = useState(true)
const [leadsError, setLeadsError] = useState('')

  const [loading, setLoading] = useState(true)
  const [carsLoading, setCarsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCars() {
    setCarsLoading(true)
    setError('')

    try {
      const data = await getCars()
      setCars(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les véhicules.',
      )
    } finally {
      setCarsLoading(false)
    }
  }
  async function loadLeads() {
  setLeadsLoading(true)
  setLeadsError('')

  try {
    const data = await getLeads()
    setLeads(data)
  } catch (err) {
    setLeadsError(
      err instanceof Error
        ? err.message
        : 'Impossible de charger les demandes.',
    )
  } finally {
    setLeadsLoading(false)
  }
}

  useEffect(() => {
    async function loadAdmin() {
      const currentAdmin = await getCurrentAdmin()

      if (!currentAdmin) {
        navigate('/admin', { replace: true })
        return
      }

      setAdmin(currentAdmin)
setLoading(false)

await Promise.all([
  loadCars(),
  loadLeads(),
])
    }

    loadAdmin()
  }, [navigate])
  async function handleDeleteCar(car: Car) {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer ${car.marque} ${car.modele} ?`,
  )

  if (!confirmed) {
    return
  }

  try {
    setError('')

    await deleteCar(car.id)

    setCars((currentCars) =>
      currentCars.filter((item) => item.id !== car.id),
    )
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Impossible de supprimer le véhicule.',
    )
  }
}
async function handleDeleteLead(lead: Lead) {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la demande de ${lead.name} ?`,
  )

  if (!confirmed) {
    return
  }

  try {
    setLeadsError('')

    await deleteLead(lead.id)

    setLeads((currentLeads) =>
      currentLeads.filter((item) => item.id !== lead.id),
    )
  } catch (err) {
    setLeadsError(
      err instanceof Error
        ? err.message
        : 'Impossible de supprimer la demande.',
    )
  }
}

  async function handleLogout() {
    await signOutAdmin()
    navigate('/admin', { replace: true })
  }

  if (loading) {
    return (
      <main className="admin-page admin-loading">
        <p>Chargement du tableau de bord...</p>
      </main>
    )
  }

  if (!admin) {
    return null
  }

  const availableCars = cars.filter((car) => car.disponible)
  const contactLeads = leads.filter(
  (lead) => lead.type === 'contact',
)

const testDriveLeads = leads.filter(
  (lead) => lead.type === 'test_drive',
)

const sellLeads = leads.filter(
  (lead) => lead.type === 'sell',
)

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <span className="admin-eyebrow">
            BEN GLOBAL SERVICE
          </span>

          <h1>Tableau de bord</h1>

          <p>
            Bienvenue, {admin.admin.full_name || admin.admin.email}
          </p>
        </div>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </header>

      <section className="admin-stats">
        <article className="admin-stat-card">
          <div className="admin-stat-icon">
            <CarFront size={22} />
          </div>

          <div>
            <span>Total véhicules</span>
            <strong>{cars.length}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon">
            <CarFront size={22} />
          </div>

          <div>
            <span>Disponibles</span>
            <strong>{availableCars.length}</strong>
          </div>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <span>Rôle</span>
            <strong>{admin.admin.role}</strong>
          </div>
        </article>
        <article className="admin-stat-card">
  <div className="admin-stat-icon">
    <MessageSquare size={22} />
  </div>

  <div>
    <span>Demandes clients</span>
    <strong>{leads.length}</strong>
  </div>
</article>
      </section>
      <section className="admin-dashboard-content">
  <div className="admin-panel">

    <div className="admin-panel-heading">
      <div>
        <span className="admin-eyebrow">
          CLIENTS
        </span>

        <h2>Demandes clients</h2>
      </div>

      <div className="admin-panel-actions">
        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadLeads}
          disabled={leadsLoading}
          title="Actualiser les demandes"
        >
          <RefreshCw
            size={17}
            className={leadsLoading ? 'spin' : ''}
          />
        </button>
      </div>
    </div>

    <div className="admin-leads-summary">
      <div>
        <MessageSquare size={18} />
        <span>Contacts</span>
        <strong>{contactLeads.length}</strong>
      </div>

      <div>
        <CarFront size={18} />
        <span>Visites / essais</span>
        <strong>{testDriveLeads.length}</strong>
      </div>

      <div>
        <DollarSign size={18} />
        <span>Ventes</span>
        <strong>{sellLeads.length}</strong>
      </div>
    </div>

    {leadsError && (
      <div className="admin-error admin-list-error">
        {leadsError}
      </div>
    )}

    {leadsLoading ? (
      <div className="admin-empty-state">
        <RefreshCw className="spin" size={36} />

        <h3>Chargement des demandes...</h3>

        <p>
          Récupération des demandes clients depuis Supabase.
        </p>
      </div>
    ) : leads.length === 0 ? (
      <div className="admin-empty-state">
        <MessageSquare size={38} />

        <h3>Aucune demande</h3>

        <p>
          Les demandes envoyées depuis le site apparaîtront ici.
        </p>
      </div>
    ) : (
      <div className="admin-leads-list">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className="admin-lead-row"
          >
            <div className="admin-lead-type">
              {lead.type === 'test_drive' ? (
                <CarFront size={20} />
              ) : lead.type === 'sell' ? (
                <DollarSign size={20} />
              ) : (
                <MessageSquare size={20} />
              )}
            </div>

            <div className="admin-lead-info">
              <div className="admin-lead-heading">
                <span className="admin-lead-name">
                  {lead.name}
                </span>

                <span
                  className={`admin-lead-badge ${lead.type}`}
                >
                  {lead.type === 'test_drive'
                    ? 'Visite / essai'
                    : lead.type === 'sell'
                      ? 'Vendre un véhicule'
                      : 'Contact'}
                </span>
              </div>

              <div className="admin-lead-details">
                <a href={`tel:${lead.phone}`}>
                  <Phone size={15} />
                  {lead.phone}
                </a>

                {lead.email && (
                  <a href={`mailto:${lead.email}`}>
                    <Mail size={15} />
                    {lead.email}
                  </a>
                )}

                <span>
                  <Calendar size={15} />
                  {new Date(
                    lead.created_at,
                  ).toLocaleString('fr-FR')}
                </span>
              </div>

              {lead.car_slug && (
                <div className="admin-lead-car">
                  Véhicule : {lead.car_slug}
                </div>
              )}

              {lead.message && (
                <p className="admin-lead-message">
                  {lead.message}
                </p>
              )}
            </div>

            <button
              type="button"
              className="admin-car-action delete"
              onClick={() => handleDeleteLead(lead)}
              title="Supprimer la demande"
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </div>
    )}
  </div>
</section>
      

      <section className="admin-dashboard-content">
        <div className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">
                INVENTAIRE
              </span>

              <h2>Véhicules</h2>
            </div>

            <div className="admin-panel-actions">
              <button
                type="button"
                className="admin-refresh-button"
                onClick={loadCars}
                disabled={carsLoading}
                title="Actualiser"
              >
                <RefreshCw
                  size={17}
                  className={carsLoading ? 'spin' : ''}
                />
              </button>

<button
  type="button"
  className="admin-primary-button"
  onClick={() => navigate("/admin/vehicules/nouveau")}
>
  <Plus size={17} />
  Ajouter un véhicule
</button>
            </div>
          </div>

          {error && (
            <div className="admin-error admin-list-error">
              {error}
            </div>
          )}

          {carsLoading ? (
            <div className="admin-empty-state">
              <RefreshCw className="spin" size={36} />

              <h3>Chargement des véhicules...</h3>

              <p>
                Récupération des données depuis Supabase.
              </p>
            </div>
          ) : cars.length === 0 ? (
            <div className="admin-empty-state">
              <CarFront size={38} />

              <h3>Aucun véhicule</h3>

              <p>
                Aucun véhicule n'est encore enregistré dans
                votre inventaire.
              </p>
            </div>
          ) : (
            <div className="admin-cars-list">
              {cars.map((car) => (
                <article
                  key={car.id}
                  className="admin-car-row"
                >
                  <div className="admin-car-image">
                    {car.images?.[0] ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.marque} ${car.modele}`}
                      />
                    ) : (
                      <CarFront size={28} />
                    )}
                  </div>

                  <div className="admin-car-info">
                    <span className="admin-car-brand">
                      {car.marque}
                    </span>

                    <h3>{car.modele}</h3>

                    <p>
                      {car.annee || '—'} ·{' '}
                      {car.kilometrage
                        ? `${car.kilometrage.toLocaleString(
                            'fr-FR',
                          )} km`
                        : 'Kilométrage —'}
                    </p>
                  </div>

                  <div className="admin-car-price">
                    {car.prix
                      ? `${car.prix.toLocaleString(
                          'fr-FR',
                        )} FCFA`
                      : 'Prix sur demande'}
                  </div>

                  <div
                    className={
                      car.disponible
                        ? 'admin-status available'
                        : 'admin-status unavailable'
                    }
                  >
                  <div className="admin-car-actions">
  <button
    type="button"
    className="admin-car-action edit"
    onClick={() =>
      navigate(`/admin/vehicules/modifier/${car.id}`)
    }
    title="Modifier le véhicule"
  >
    <Pencil size={16} />
  </button>

  <button
    type="button"
    className="admin-car-action delete"
    onClick={() => handleDeleteCar(car)}
    title="Supprimer le véhicule"
  >
    <Trash2 size={16} />
  </button>
</div>
                    {car.disponible
                      ? 'Disponible'
                      : 'Indisponible'}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}