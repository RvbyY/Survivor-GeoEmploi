import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import type { Listing } from '../data/mockListings'

type MapProps = {
  listings: Listing[]
  center: [number, number]
  hoveredId: number | null
  onHoverMarker: (id: number | null) => void
  isListOpen: boolean
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

export default function MapComponent({ listings, center, hoveredId, onHoverMarker, isListOpen }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<number, L.Marker>>(new Map())
  const navigate = useNavigate()

  // Create the map once, on mount.
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current).setView(center, 10)

    const handlePopupClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    const button = target.closest(
      '.listing-popup__details'
    ) as HTMLElement | null

    if (!button) return

    const listingId = button.dataset.listingId

    if (!listingId) return

    event.preventDefault()
    event.stopPropagation()

    navigate(`/offres/${listingId}`)
  }

  mapRef.current.addEventListener('click', handlePopupClick)

    const franceBounds = L.latLngBounds([41.0, -5.5], [51.5, 10.0])
    map.setMaxBounds(franceBounds)
    map.setMinZoom(5)

    L.tileLayer(
      'https://data.geopf.fr/wmts?' +
        'SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile' +
        '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' +
        '&STYLE=normal&FORMAT=image/png' +
        '&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
      { attribution: '&copy; IGN-F/Géoportail', noWrap: true }
    ).addTo(map)

    mapInstance.current = map

    return () => {
      mapRef.current?.removeEventListener('click', handlePopupClick)
      map.remove()
      mapInstance.current = null
    }
  }, [])

  // Fly to the new center whenever it changes.
  useEffect(() => {
    if (!mapInstance.current) return
    mapInstance.current.flyTo(center, 12, { duration: 1 })
  }, [center])

  useEffect(() => {
    const timeout = setTimeout(() => {
      mapInstance.current?.invalidateSize()
    }, 300)
    return () => clearTimeout(timeout)
  }, [isListOpen])

  // Rebuild markers whenever the listing set changes.
  useEffect(() => {
    if (!mapInstance.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    let closeTimeout: ReturnType<typeof setTimeout> | null = null

    listings.forEach((listing) => {
      const summaryPreview =
        listing.summary.length > 90
          ? listing.summary.slice(0, 90) + '…'
          : listing.summary

      const popupHtml = `
        <div class="listing-popup__content">
          <p class="listing-popup__company">${listing.company}</p>
          <p class="listing-popup__title">${listing.title}</p>
          <p class="listing-popup__summary">${summaryPreview}</p>
          <button class="btn btn--primary listing-popup__details" data-listing-id="${listing.id}">
            Voir les détails
          </button>
        </div>
      `

      const marker = L.marker([listing.lat, listing.lng], { icon: listingIcon })
        .addTo(mapInstance.current!)
        .bindPopup(popupHtml, { className: 'listing-popup' })

      marker.on('mouseover', () => {
        if (closeTimeout) clearTimeout(closeTimeout)
        marker.openPopup()
        onHoverMarker(listing.id)
      })
      marker.on('mouseout', () => {
        // Don't close immediately — give the cursor time to reach the popup.
        closeTimeout = setTimeout(() => {
          marker.closePopup()
          onHoverMarker(null)
        }, 200)
      })

      marker.on('popupopen', () => {
        const popupEl = marker.getPopup()?.getElement()

        if (!popupEl) return

        popupEl.addEventListener('mouseenter', () => {
          if (closeTimeout) clearTimeout(closeTimeout)
        })

        popupEl.addEventListener('mouseleave', () => {
          closeTimeout = setTimeout(() => {
            marker.closePopup()
            onHoverMarker(null)
          }, 200)
        })
      })


      markersRef.current.set(listing.id, marker)
    })
  }, [listings, navigate, onHoverMarker])

  // React to hover coming FROM the offer list (open/close the matching popup).
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      if (id === hoveredId) {
        marker.openPopup()
      } else {
        marker.closePopup()
      }
    })
  }, [hoveredId])

  return <div ref={mapRef} style={{ height: '100%' }} />
}