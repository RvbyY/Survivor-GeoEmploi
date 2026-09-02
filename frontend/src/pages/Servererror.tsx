// src/pages/ServerError.tsx
import BrandBlock from '../components/Brandblock'

export default function ServerError() {
  return (
    <div className="status-page">
      <BrandBlock />
      <h1>500</h1>
      <p>Une erreur est survenue de notre côté. Réessayez dans quelques instants.</p>
      <div className="status-page__divider" />
      <a href="/">Retour à l'accueil</a>
    </div>
  )
}