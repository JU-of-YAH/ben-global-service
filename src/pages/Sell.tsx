import { FormEvent, useState } from 'react'
import {
  CarFront,
  Send,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { SectionTitle } from '../components/SectionTitle'
import { supabase } from '../lib/supabase'
import { PageNavigation } from "../components/PageNavigation";

export function Sell() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setSent(false)
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = String(formData.get('name') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const email = String(formData.get('email') || '').trim()

    const message = String(
      formData.get('message') || '',
    ).trim()

    const vehicle = String(
      formData.get('vehicle') || '',
    ).trim()

    const year = String(
      formData.get('year') || '',
    ).trim()

    const mileage = String(
      formData.get('mileage') || '',
    ).trim()

    try {
      const fullMessage = [
        vehicle && `Véhicule : ${vehicle}`,
        year && `Année : ${year}`,
        mileage && `Kilométrage : ${mileage}`,
        message && `Détails : ${message}`,
      ]
        .filter(Boolean)
        .join('\n')

      const { error: supabaseError } =
        await supabase
          .from('leads')
          .insert({
            type: 'sell',
            name,
            phone,
            email: email || null,
            message: fullMessage || null,
            car_slug: null,
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

  return (
    <section className="section page">
      <SectionTitle
        eyebrow="Vendre votre véhicule"
        title="Confiez-nous votre véhicule"
        text="Vous souhaitez vendre votre voiture ? Présentez-nous votre véhicule et notre équipe vous recontactera."
      />
      
      <PageNavigation
  backTo="/"
  backLabel="Accueil"
  nextTo="/vehicules"
  nextLabel="Voir les véhicules"
/>

      <div className="contact-grid">
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
            Véhicule

            <input
              required
              name="vehicle"
              placeholder="Ex. Toyota Land Cruiser"
            />
          </label>

          <div className="sell-form-row">
            <label>
              Année

              <input
                name="year"
                type="number"
                min="1900"
                max="2100"
                placeholder="2022"
              />
            </label>

            <label>
              Kilométrage

              <input
                name="mileage"
                type="number"
                min="0"
                placeholder="45000"
              />
            </label>
          </div>

          <label>
            Informations complémentaires

            <textarea
              required
              name="message"
              rows={6}
              placeholder="Décrivez votre véhicule, son état, ses équipements, etc."
            />
          </label>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {sent && (
            <p className="success">
              Votre demande de vente a bien été
              envoyée. Notre équipe vous contactera
              prochainement.
            </p>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            <Send size={17} />

            {loading
              ? 'Envoi en cours...'
              : 'Envoyer ma demande'}
          </button>
        </form>

        <aside className="contact-aside">
          <div className="sell-info-card">
            <CarFront size={28} />

            <h3>Vendre avec BEN GLOBAL SERVICE</h3>

            <p>
              Présentez-nous votre véhicule et
              notre équipe étudiera votre demande.
            </p>
          </div>

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

              <strong>Nous écrire</strong>
            </span>
          </a>
        </aside>
      </div>
    </section>
  )
}

