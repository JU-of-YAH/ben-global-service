import { FormEvent, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LockKeyhole, LogIn, LoaderCircle } from 'lucide-react'
import { getCurrentAdmin, signInAdmin } from '../lib/auth'

type AdminSession = Awaited<ReturnType<typeof getCurrentAdmin>>

export default function Admin() {
  const [admin, setAdmin] = useState<AdminSession>(undefined)
  const [checking, setChecking] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkSession() {
      const currentAdmin = await getCurrentAdmin()

      setAdmin(currentAdmin)
      setChecking(false)
    }

    checkSession()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const result = await signInAdmin(email.trim(), password)

      setAdmin(result)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="admin-page admin-loading">
        <LoaderCircle className="spin" size={32} />
        <p>Vérification de la session...</p>
      </main>
    )
  }

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <main className="admin-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <LockKeyhole size={26} />
        </div>

        <div className="admin-login-heading">
          <span>BEN GLOBAL SERVICE</span>
          <h1>Administration</h1>
          <p>
            Connectez-vous pour accéder à votre espace
            d'administration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label>
            Adresse e-mail

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@exemple.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Mot de passe

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="spin" size={18} />
                Connexion...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          BEN GLOBAL SERVICE · Espace sécurisé
        </p>
      </div>
    </main>
  )
}