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

export default function Map({ listings, center }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  // Create the map ONCE, on mount only.
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current).setView(center, 6)

    L.tileLayer(
      'https://data.geopf.fr/wmts?' +
        'SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile' +
        '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' +
        '&STYLE=normal&FORMAT=image/png' +
        '&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
      { minZoom: 3,
        maxZoom: 19,
        attribution: '&copy; IGN-F/Géoportail'
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
      L.marker([listing.lat, listing.lng])
        .addTo(mapInstance.current!)
        .bindPopup(listing.title)
    )
  }, [listings])

  return <div ref={mapRef} style={{ height: '100%' }} />
}