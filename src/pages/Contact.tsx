import { FormEvent, useEffect, useState } from 'react'
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  CarFront,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { SectionTitle } from '../components/SectionTitle'
import { PageNavigation } from '../components/PageNavigation'
import { supabase } from '../lib/supabase'
import type { Car } from '../lib/cars'

type LeadType = 'contact' | 'test_drive'

export function Contact() {
  const [searchParams] = useSearchParams()

  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [leadType, setLeadType] =
    useState<LeadType>('contact')

  const [car, setCar] = useState<Car | null>(null)

  /* =========================
     CHARGER LE TYPE ET LE VÉHICULE
  ========================= */

  useEffect(() => {
    const type = searchParams.get('type')
    const carSlug = searchParams.get('car')

    if (type === 'test_drive') {
      setLeadType('test_drive')
    } else {
      setLeadType('contact')
    }

    async function loadCar() {
      if (!carSlug) {
        setCar(null)
        return
      }

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('slug', carSlug)
        .single()

      if (error) {
        console.error(
          'Impossible de récupérer le véhicule :',
          error.message,
        )

        setCar(null)
        return
      }

      setCar(data as Car)
    }

    loadCar()
  }, [searchParams])

  /* =========================
     ENVOI DU FORMULAIRE
  ========================= */

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setLoading(true)
    setSent(false)
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = String(
      formData.get('name') || '',
    ).trim()

    const phone = String(
      formData.get('phone') || '',
    ).trim()

    const email = String(
      formData.get('email') || '',
    ).trim()

    const message = String(
      formData.get('message') || '',
    ).trim()

    const carSlug = searchParams.get('car')

    try {
      const { error: supabaseError } =
        await supabase
          .from('leads')
          .insert({
            type: leadType,
            name,
            phone,
            email: email || null,
            message,
            car_slug: carSlug || null,
          })

      if (supabaseError) {
        throw new Error(
          supabaseError.message,
        )
      }

      setSent(true)
      form.reset()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible d’envoyer votre demande.',
      )
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     CONTENU DYNAMIQUE
  ========================= */

  const title =
    leadType === 'test_drive'
      ? 'Demander une visite'
      : 'Parlons de votre projet'

  const text =
    leadType === 'test_drive'
      ? 'Laissez vos coordonnées afin que nous puissions organiser votre visite du véhicule.'
      : 'Laissez vos coordonnées et votre besoin.'

  return (
    <section className="section page">

      {/* =========================
          NAVIGATION
      ========================= */}

      <PageNavigation
        backTo="/"
        backLabel="Accueil"
        nextTo="/vehicules"
        nextLabel="Voir les véhicules"
      />

      {/* =========================
          TITRE
      ========================= */}

      <SectionTitle
        eyebrow={
          leadType === 'test_drive'
            ? 'Visite / essai'
            : 'Contact'
        }
        title={title}
        text={text}
      />

      {/* =========================
          VÉHICULE CONCERNÉ
      ========================= */}

      {car && (
        <div className="contact-car-card">
          {car.images?.[0] ? (
            <img
              src={car.images[0]}
              alt={`${car.marque} ${car.modele}`}
            />
          ) : (
            <div className="contact-car-placeholder">
              <CarFront size={28} />
            </div>
          )}

          <div>
            <span>Véhicule concerné</span>

            <strong>
              {car.marque} {car.modele}
            </strong>

            {car.annee && (
              <small>{car.annee}</small>
            )}
          </div>
        </div>
      )}

      {/* =========================
          FORMULAIRE + CONTACT
      ========================= */}

      <div className="contact-grid">

        {/* FORMULAIRE */}

        <form
          className="contact-form"
          onSubmit={submit}
        >

          <label>
            Nom

            <input
              required
              name="name"
              placeholder="Votre nom"
            />
          </label>

          <label>
            Téléphone

            <input
              required
              name="phone"
              placeholder="+225 ..."
            />
          </label>

          <label>
            Email

            <input
              type="email"
              name="email"
              placeholder="vous@email.com"
            />
          </label>

          <label>
            Votre demande

            <textarea
              required
              name="message"
              rows={6}
              placeholder={
                leadType === 'test_drive'
                  ? 'Indiquez vos disponibilités pour la visite...'
                  : 'Décrivez votre projet...'
              }
            />
          </label>

          {/* ERREUR */}

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {/* SUCCÈS */}

          {sent && (
            <p className="success">
              Votre demande a bien été envoyée.
              Nous vous contacterons prochainement.
            </p>
          )}

          {/* BOUTON */}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            <Send size={17} />

            {loading
              ? 'Envoi en cours...'
              : 'Envoyer la demande'}
          </button>

        </form>

        {/* =========================
            COORDONNÉES
        ========================= */}

        <aside className="contact-aside">

          <a href="tel:+2250509496745">
            <Phone />

            <span>
              <small>Téléphone</small>

              <strong>
                +225 05 09 49 67 45
              </strong>
            </span>
          </a>

          <a href="mailto:Benglobalservices7@gmail.com">
            <Mail />

            <span>
              <small>Email</small>

              <strong>
                Benglobalservices7@gmail.com
              </strong>
            </span>
          </a>

          <a
            href="https://wa.me/2250509496745"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle />

            <span>
              <small>WhatsApp</small>

              <strong>
                Nous écrire
              </strong>
            </span>
          </a>

        </aside>
      </div>
    </section>
  )
}

