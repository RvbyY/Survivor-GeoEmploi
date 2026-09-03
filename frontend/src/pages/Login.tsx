import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandBlock from '../components/Brandblock'
import '../Auth.css'

type AccountType = 'jobseeker' | 'employer'
type Mode = 'login' | 'signup'

type FormState = {
  email: string
  password: string
  name: string
  companyName: string
}

const initialForm: FormState = {
  email: '',
  password: '',
  name: '',
  companyName: '',
}

export default function Login() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('signup')
  const [accountType, setAccountType] = useState<AccountType>('jobseeker')
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<string[]>([])

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate(): string[] {
    const problems: string[] = []

    if (!form.email.includes('@')) {
      problems.push('Adresse e-mail invalide.')
    }
    if (form.password.length < 8) {
      problems.push('Le mot de passe doit contenir au moins 8 caractères.')
    }
    if (mode === 'signup' && form.name.trim() === '') {
      problems.push('Le nom est requis.')
    }
    if (mode === 'signup' && accountType === 'employer' && form.companyName.trim() === '') {
      problems.push("Le nom de l'entreprise est requis.")
    }

    return problems
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const problems = validate()
    setErrors(problems)
    if (problems.length > 0) return

    // TODO: replace with a real call once the backend auth endpoint exists.
    console.log('Submitting', { mode, accountType, form })
    navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <BrandBlock variant="dark" />
        <Link to="/" className="auth-close" aria-label="Retour à l'accueil">
            ×
        </Link>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'signup' ? 'auth-tab auth-tab--active' : 'auth-tab'}
            onClick={() => setMode('signup')}
          >
            Créer un compte
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'}
            onClick={() => setMode('login')}
          >
            Se connecter
          </button>
        </div>

        {mode === 'signup' && (
          <div className="auth-type-toggle">
            <button
              type="button"
              className={
                accountType === 'jobseeker'
                  ? 'auth-type-btn auth-type-btn--active'
                  : 'auth-type-btn'
              }
              onClick={() => setAccountType('jobseeker')}
            >
              Candidat
            </button>
            <button
              type="button"
              className={
                accountType === 'employer'
                  ? 'auth-type-btn auth-type-btn--active'
                  : 'auth-type-btn'
              }
              onClick={() => setAccountType('employer')}
            >
              Employeur
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <label className="auth-field">
              <span>{accountType === 'employer' ? 'Nom du contact' : 'Nom complet'}</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </label>
          )}

          {mode === 'signup' && accountType === 'employer' && (
            <label className="auth-field">
              <span>Nom de l'entreprise</span>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
              />
            </label>
          )}

          <label className="auth-field">
            <span>E-mail</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </label>

          {errors.length > 0 && (
            <ul className="auth-errors">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          <button type="submit" className="btn btn--primary auth-submit">
            {mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}