import { useState } from 'react'
import { useAuth } from '../context/Authcontext'
import { useReports } from '../context/Reportscontext'

const REPORT_REASONS = [
  'Offre frauduleuse',
  'Informations incorrectes',
  'Offre expirée / déjà pourvue',
  'Contenu inapproprié',
  'Autre',
]

export default function ReportOffer({
  offerId,
}: {
  offerId: number
}) {
  const { isLoggedIn } = useAuth()
  const { reportOffer } = useReports()

  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState(REPORT_REASONS[0])
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!isLoggedIn) {
    return null
  }

  if (isSubmitted) {
    return (
      <p className="report-offer__confirmation">
        Signalement envoyé, merci.
      </p>
    )
  }

  if (!isOpen) {
    return (
      <button
        className="report-offer__trigger"
        onClick={() => setIsOpen(true)}
      >
        Signaler cette offre
      </button>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await reportOffer(
        offerId,
        reason,
        comment
      )

      setIsSubmitted(true)
    } catch {
      setSubmitError(
        "Impossible d'envoyer le signalement pour le moment."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="report-offer__form"
      onSubmit={handleSubmit}
    >
      <label>
        Motif

        <select
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
        >
          {REPORT_REASONS.map((r) => (
            <option
              key={r}
              value={r}
            >
              {r}
            </option>
          ))}
        </select>
      </label>

      <label>
        Précisions (facultatif)

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />
      </label>

      {submitError && (
        <p className="report-offer__error">
          {submitError}
        </p>
      )}

      <div className="report-offer__actions">
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Envoi...'
            : 'Envoyer le signalement'}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
        >
          Annuler
        </button>
      </div>
    </form>
  )
}