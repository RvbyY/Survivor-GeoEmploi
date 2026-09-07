export default function ServerError() {
  return (
    <div className="status-page">
      <h1>500</h1>
      <p>Une erreur est survenue de notre côté. Réessayez dans quelques instants.</p>
      <div className="status-page__divider" />
      <a href="/">Retour à l'accueil</a>
    </div>
  )
}