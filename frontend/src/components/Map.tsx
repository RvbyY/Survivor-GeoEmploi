import { useEffect, useRef } from "react";
import L from "leaflet";

export default function Map() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([ 48.5833, 7.7500], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        return () => {
            map.remove();
        };
    }, []);

    return <div ref={mapRef} style={{ height: "500px" }} />;
}