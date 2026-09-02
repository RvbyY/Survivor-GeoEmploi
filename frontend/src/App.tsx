import { useEffect, useState } from 'react'
import './App.css'
import Map from './components/Map.tsx'
import LoadingSpinner from './components/Loadingspinner.tsx'

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude])
      },
      (error) => {
        console.log('Geolocation refused or unavailable:', error.message)
        setMapCenter([48.5833, 7.75])
      }
    )
  }, [])


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
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

export default App