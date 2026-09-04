import Map from '../components/Map'
import OfferList from '../components/Offerlist'
import LoadingSpinner from '../components/Loadingspinner'
import CitySearchForm from '../components/Citysearchform'
import { geocodeCity } from '../api/geocode'
import mockListings from '../data/mockListings'
import type { Listing } from '../data/mockListings'
import { useState } from 'react'

function MapPage() {
  const [listings] = useState<Listing[]>(mockListings)
  const FRANCE_CENTER: [number, number] = [46.6034, 1.8883]

  const [mapCenter, setMapCenter] =
    useState<[number, number]>(FRANCE_CENTER)

  const [askedLocation, setAskedLocation] = useState(false)
  const [locationDenied, setLocationDenied] = useState(false)
  const [hasLocation, setHasLocation] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)

  function requestLocation() {
    setAskedLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([
          position.coords.latitude,
          position.coords.longitude
        ])
        setHasLocation(true)
      },
      (error) => {
        console.log(
          'Geolocation refused or unavailable:',
          error.message
        )
        setLocationDenied(true)
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000
      }
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
    <div className="map-page">
      <main className="map-stage">
        <button
          className="list-toggle"
          onClick={() => setIsListOpen((open) => !open)}
          aria-label={isListOpen ? 'Masquer la liste des offres' : 'Afficher la liste des offres'}
        >
          {isListOpen ? '›' : '‹'}
        </button>

        <div
          className={
            hasLocation
              ? 'map-layer map-layer--visible'
              : 'map-layer'
          }
        >
          <Map
            listings={listings}
            center={mapCenter}
            hoveredId={hoveredId}
            onHoverMarker={setHoveredId}
            isListOpen={isListOpen}
          />
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
                <p>
                  Autorisez la localisation pour de meilleurs résultats,
                  ou saisissez une ville.
                </p>

                <div className="location-card__actions">
                  <button
                    className="btn btn--primary"
                    onClick={requestLocation}
                  >
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

      <OfferList
        listings={listings}
        hoveredId={hoveredId}
        onHover={setHoveredId}
        collapsed={!isListOpen}
      />
    </div>
  )
}

export default MapPage