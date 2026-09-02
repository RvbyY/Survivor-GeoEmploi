import BrandBlock from "../components/Brandblock"

export default function NotFound() {
  return (
    <div className="status-page">
            <BrandBlock />
      <h1>404</h1>
      <p>Cette page n'existe pas.</p>
      <a href="/">Retour à l'accueil</a>
    </div>
  )
}