import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import LoadingSpinner from './components/Loadingspinner'
import CitySearchForm from './components/Citysearchform'
import BrandBlock from './components/Brandblock'
import { geocodeCity } from './api/geocode'

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

function App() {
  const [listings] = useState<Listing[]>(mockListings)
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [askedLocation, setAskedLocation] = useState(false)
  const [locationDenied, setLocationDenied] = useState(false)

  function requestLocation() {
    setAskedLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude])
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
      return true
    }
    return false
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <BrandBlock />
        <span className="offer-count">
          {listings.length} offre{listings.length > 1 ? 's' : ''}
        </span>
      </header>

      <main className="map-stage">
        {mapCenter && <Map listings={listings} center={mapCenter} />}

        {!mapCenter && (
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
                  <button
                    className="btn btn--secondary"
                    onClick={() => setLocationDenied(true)}
                  >
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

export default App