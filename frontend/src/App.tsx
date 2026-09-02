import { useEffect, useState } from 'react'
import './App.css'
import Map from './components/Map.tsx'
import LoadingSpinner from './components/Loadingspinner'
import CitySearchForm from './components/Citysearchform'
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
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [locationDenied, setLocationDenied] = useState(false)
  const [askedLocation, setAskedLocation] = useState(false)

  function requestLocation() {
    setAskedLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude])
      },
      (error) => {
        console.log('Geolocation refused or unavailable:', error.message)
        setLocationDenied(true)
      }
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
    <div>
      <h1>GéoEmploi</h1>
      <p>Listings loaded: {listings.length}</p>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>{listing.title}</li>
        ))}
      </ul>
 
      {mapCenter ? (
        <Map listings={listings} center={mapCenter} />
      ) : locationDenied ? (
        <CitySearchForm onSubmit={handleCitySubmit} />
      ) : askedLocation ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <p>Allow location access for a better experience, or enter your city.</p>
          <button onClick={requestLocation}>Use my location</button>
          <button onClick={() => setLocationDenied(true)}>Enter city instead</button>
        </div>
      )}
    </div>
  )
}


export default App