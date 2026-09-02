import { useState } from 'react'
import Map from '../components/Map'
import LoadingSpinner from '../components/Loadingspinner'
import CitySearchForm from '../components/Citysearchform'
import BrandBlock from '../components/Brandblock'
import { geocodeCity } from '../api/geocode'
import { Link } from 'react-router-dom'

type Listing = {
  id: number
  title: string
  lat: number
  lng: number
}

const mockListings: Listing[] = [
  { id: 1, title: 'Développeur Backend', lat: 48.8566, lng: 2.3522 },   // Paris
  { id: 2, title: 'Développeur Frontend', lat: 45.7640, lng: 4.8357 }, // Lyon
  { id: 3, title: 'DevOps Engineer', lat: 43.2965, lng: 5.3698 },      // Marseille
]

function Home() {
  const [listings] = useState<Listing[]>(mockListings)
  const FRANCE_CENTER: [number, number] = [46.6034, 1.8883]

  const [mapCenter, setMapCenter] = useState<[number, number]>(FRANCE_CENTER)
  const [askedLocation, setAskedLocation] = useState(false)
  const [locationDenied, setLocationDenied] = useState(false)

  const [hasLocation, setHasLocation] = useState(false)

  function requestLocation() {
    setAskedLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude])
        setHasLocation(true)
      },
      (error) => {
        console.log('Geolocation refused or unavailable:', error.message)
        setLocationDenied(true)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    )
  }

  async function handleCitySubmit(city: string): Promise<boolean> {
    const coords = await geocodeCity(city)
    if (coords) {
      setMapCenter(coords)
      setHasLocation(true)
      return true
    }
    return false
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <BrandBlock />
        <Link to="/login" className="btn btn--secondary-on-dark">Se connecter</Link>
        <span className="offer-count">
          {listings.length} offre{listings.length > 1 ? 's' : ''}
        </span>
      </header>

      <main className="map-stage">
        <div className={hasLocation ? 'map-layer map-layer--visible' : 'map-layer'}>
          <Map listings={listings} center={mapCenter} />
        </div>
        {!hasLocation && (
          <div className="location-card">
            {locationDenied ? (
              <CitySearchForm onSubmit={handleCitySubmit} />
            ) : askedLocation ? (
              <div className="location-card__loading">
                <LoadingSpinner />
                <p>Localisation en cours…</p>
              </div>
            ) : (
              <div className="location-card__prompt">
                <p>Autorisez la localisation pour de meilleurs résultats, ou saisissez une ville.</p>
                <div className="location-card__actions">
                  <button className="btn btn--primary" onClick={requestLocation}>
                    Utiliser ma position
                  </button>
                  <button className="btn btn--secondary" onClick={() => setLocationDenied(true)}>
                    Saisir une ville
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home