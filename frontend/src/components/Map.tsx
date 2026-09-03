import { useEffect, useRef } from 'react'
import L from 'leaflet'

type Listing = {
  id: number
  title: string
  lat: number
  lng: number
}

type MapProps = {
  listings: Listing[]
  center: [number, number]
}

const listingIcon = L.divIcon({
  className: 'listing-marker',
  html: `
    <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 9.8 14 22 14 22s14-12.2 14-22C28 6.3 21.7 0 14 0z" fill="#1B3A6B"/>
      <circle cx="14" cy="14" r="5.5" fill="#ffffff"/>
    </svg>
  `,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
})

export default function Map({ listings, center }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  // Create the map ONCE, on mount only.
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current).setView(center, 6)


    const franceBounds = L.latLngBounds([41.0, -5.5], [51.5, 10.0])
    map.setMaxBounds(franceBounds)
    map.setMinZoom(5)

    L.tileLayer(
      'https://data.geopf.fr/wmts?' +
        'SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile' +
        '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' +
        '&STYLE=normal&FORMAT=image/png' +
        '&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
      {
        attribution: '&copy; IGN-F/Géoportail',
        noWrap: true
      }
    ).addTo(map)

    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, []) // empty deps — this runs exactly once, never again

  // Fly to the new center whenever it changes.
  useEffect(() => {
    if (!mapInstance.current) return
    mapInstance.current.flyTo(center, 13, { duration: 1.2 })
  }, [center])

  // Redraw markers whenever listings change.
  useEffect(() => {
    if (!mapInstance.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = listings.map((listing) =>
      L.marker([listing.lat, listing.lng], { icon: listingIcon })
        .addTo(mapInstance.current!)
        .bindPopup(listing.title, { className: 'listing-popup' })
    )
  }, [listings])

  return <div ref={mapRef} style={{ height: '100%' }} />
}