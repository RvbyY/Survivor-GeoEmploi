import { useEffect, useRef } from "react";
import L from "leaflet";


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
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView(center, 13);

        L.tileLayer(
        "https://data.geopf.fr/wmts?" +
            "SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile" +
            "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" +
            "&STYLE=normal&FORMAT=image/png" +
            "&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
        {
            attribution: "&copy; IGN-F/Géoportail",
            minZoom: 0,
            maxZoom: 19,
        }
        ).addTo(map);

        listings.forEach((listing) => {
            L.marker([listing.lat, listing.lng])
            .addTo(map)
            .bindPopup(listing.title)
        })

        return () => {
            map.remove();
        };
    }, [center, listings]);

    return <div ref={mapRef} style={{ height: "500px" }} />;
}