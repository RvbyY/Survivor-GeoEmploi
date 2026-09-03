type Listing = {
  id: number
  title: string
  lat: number
  lng: number
}

const mockListings: Listing[] = [
  // Strasbourg intra-muros
  { id: 1, title: 'Développeur Backend — Alsatech', lat: 48.5734, lng: 7.7521 },
  { id: 2, title: 'Chargée de communication — Cigogne Digital', lat: 48.5820, lng: 7.7455 },
  { id: 3, title: 'Data Analyst — NovaRhin', lat: 48.5850, lng: 7.7590 },
  { id: 4, title: 'Assistant RH — Kleber Informatique', lat: 48.5789, lng: 7.7460 },
  { id: 5, title: 'Ingénieur réseau — Strasnet Solutions', lat: 48.5701, lng: 7.7633 },

  // Illkirch-Graffenstaden
  { id: 6, title: 'Développeuse Frontend — Ill Valley Tech', lat: 48.5333, lng: 7.7167 },
  { id: 7, title: 'Technicien support informatique — Rhénacom', lat: 48.5290, lng: 7.7200 },

  // Schiltigheim
  { id: 8, title: 'Comptable — Vosges Software', lat: 48.6050, lng: 7.7510 },
  { id: 9, title: 'Chef de projet digital — EuroRhin Systems', lat: 48.6020, lng: 7.7480 },

  // Haguenau
  { id: 10, title: 'Vendeur en magasin — Maison Fischer', lat: 48.8167, lng: 7.7833 },
  { id: 11, title: 'Product Owner — Cathédrale Data', lat: 48.8140, lng: 7.7900 },

  // Colmar
  { id: 12, title: 'Designer UX/UI — Alsatech', lat: 48.0794, lng: 7.3585 },
  { id: 13, title: 'Ingénieur DevOps — NovaRhin', lat: 48.0750, lng: 7.3620 },

  // Mulhouse
  { id: 14, title: 'Administrateur systèmes — Strasnet Solutions', lat: 47.7508, lng: 7.3359 },
  { id: 15, title: 'Responsable logistique — Manufacture du Rhin', lat: 47.7460, lng: 7.3400 },

  // Sélestat
  { id: 16, title: 'Consultant SAP — EuroRhin Systems', lat: 48.2603, lng: 7.4547 },

  // Saverne
  { id: 17, title: 'Développeur mobile — Cigogne Digital', lat: 48.7406, lng: 7.3622 },

  // Obernai
  { id: 18, title: 'Chargé de clientèle — Rhénacom', lat: 48.4667, lng: 7.4833 },

  // Molsheim
  { id: 19, title: 'Technicien de maintenance — Manufacture du Rhin', lat: 48.5333, lng: 7.5000 },

  // A few further afield, so the map isn't one single cluster
  { id: 20, title: 'Ingénieur DevOps', lat: 48.8566, lng: 2.3522 }, // Paris
  { id: 21, title: 'Développeur Backend', lat: 45.7640, lng: 4.8357 }, // Lyon
  { id: 22, title: 'Data Analyst', lat: 43.2965, lng: 5.3698 },        // Marseille
]

export default mockListings
export type { Listing }