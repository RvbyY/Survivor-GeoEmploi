import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-eyebrow">MINISTÈRE DU JOB ET BONHEUR</p>

          <h1>
            Trouvez votre prochain
            <span> job près de chez vous.</span>
          </h1>

          <p className="home-hero__description">
            GéoEmploi vous permet de découvrir les opportunités
            professionnelles autour de vous, directement sur une carte.
          </p>

          <div className="home-hero__actions">
            <Link to="/map" className="btn btn--primary home-hero__primary">
              Explorer les offres
              <span>→</span>
            </Link>

            <Link to="/login" className="home-hero__secondary">
              Créer mon profil
            </Link>
          </div>

          <p className="home-hero__note">
            Consultation libre · Aucun compte nécessaire
          </p>
        </div>

        <div className="home-hero__visual">
          <div className="home-map">
            <div className="home-map__grid" />

            <div className="home-map__road home-map__road--one" />
            <div className="home-map__road home-map__road--two" />
            <div className="home-map__road home-map__road--three" />

            <div className="home-map__marker home-map__marker--one">
              <span />
            </div>

            <div className="home-map__marker home-map__marker--two">
              <span />
            </div>

            <div className="home-map__marker home-map__marker--three">
              <span />
            </div>

            <div className="home-map__marker home-map__marker--four">
              <span />
            </div>

            <div className="home-map__card">
              <p>Développeur logiciel</p>
              <span>Strasbourg · 2,4 km</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-intro">
        <p className="home-section-label">GÉOEMPLOI_ / COMMENT ÇA MARCHE</p>

        <h2>
          L'emploi,
          <br />
          <span>là où vous êtes.</span>
        </h2>

        <p>
          Plus besoin de parcourir des dizaines de pages d'annonces.
          Visualisez les opportunités directement autour de vous et trouvez
          celles qui correspondent à votre projet.
        </p>
      </section>

      <section className="home-features">
        <article className="home-feature">
          <span className="home-feature__number">01</span>
          <div>
            <h3>Trouvez</h3>
            <p>
              Explorez les offres d'emploi sur une carte interactive et
              découvrez les opportunités à proximité.
            </p>
          </div>
        </article>

        <article className="home-feature">
          <span className="home-feature__number">02</span>
          <div>
            <h3>Postulez</h3>
            <p>
              Créez votre profil professionnel et envoyez votre candidature
              directement depuis GéoEmploi.
            </p>
          </div>
        </article>

        <article className="home-feature">
          <span className="home-feature__number">03</span>
          <div>
            <h3>Suivez</h3>
            <p>
              Gardez une vue claire sur vos candidatures et l'avancement de
              vos démarches.
            </p>
          </div>
        </article>
      </section>

      <section className="home-employer">
        <div>
          <p className="home-section-label">POUR LES EMPLOYEURS</p>

          <h2>
            Les bons profils,
            <br />
            <span>au bon endroit.</span>
          </h2>

          <p>
            Publiez vos offres, définissez leur zone géographique et recevez
            les candidatures des professionnels qui correspondent à vos
            besoins.
          </p>

          <Link to="/login" className="home-employer__link">
            Publier une offre <span>→</span>
          </Link>
        </div>

        <div className="home-employer__stats">
          <div>
            <strong>30</strong>
            <span>jours avant archivage</span>
          </div>

          <div>
            <strong>100%</strong>
            <span>géolocalisé</span>
          </div>

          <div>
            <strong>0€</strong>
            <span>pour consulter les offres</span>
          </div>
        </div>
      </section>

      <section className="home-final">
        <p>GÉOEMPLOI_</p>

        <h2>
          Votre prochain
          <br />
          <span>job est peut-être ici.</span>
        </h2>

        <Link to="/map" className="btn btn--primary">
          Voir les offres
          <span>→</span>
        </Link>
      </section>

      <footer className="home-footer">
        <span>GÉOEMPLOI_</span>

        <div>
          <Link to="/map">Carte</Link>
          <Link to="/login">Connexion</Link>
        </div>

        <span>© 2026 · Ministère du Job et Bonheur</span>
      </footer>
    </main>
  )
}

export default Home