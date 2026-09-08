import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <span>GÉOEMPLOI_</span>

      <div>
        <Link to="/map">Carte</Link>
        <Link to="/login">Connexion</Link>
      </div>

      <span>Démonstrateur technique, ne constitue pas un service public en exploitation. </span>

      <span>© 2026 · GéoEmploi</span>
    </footer>
  )
}