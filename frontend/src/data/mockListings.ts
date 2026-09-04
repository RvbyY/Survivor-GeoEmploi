export type Listing = {
  id: number
  title: string
  company: string
  summary: string
  lat: number
  lng: number
}

const mockListings: Listing[] = [
  { id: 1, title: 'Développeur Backend', company: 'Alsatech', summary: "Rejoignez notre équipe pour développer les APIs de notre plateforme de gestion de flotte, en Go et PostgreSQL.", lat: 48.5734, lng: 7.7521 },
  { id: 2, title: 'Chargée de communication', company: 'Cigogne Digital', summary: "Pilotez la stratégie de communication digitale d'une agence en pleine croissance, réseaux sociaux et contenus inclus.", lat: 48.5820, lng: 7.7455 },
  { id: 3, title: 'Data Analyst', company: 'NovaRhin', summary: "Analysez les données de nos clients industriels pour optimiser leurs chaînes de production.", lat: 48.5850, lng: 7.7590 },
  { id: 4, title: 'Assistant RH', company: 'Kleber Informatique', summary: "Accompagnez le recrutement et l'intégration de nos nouveaux collaborateurs dans une PME de 40 personnes.", lat: 48.5789, lng: 7.7460 },
  { id: 5, title: 'Ingénieur réseau', company: 'Strasnet Solutions', summary: "Administrez et sécurisez l'infrastructure réseau de nos clients professionnels en Alsace.", lat: 48.5701, lng: 7.7633 },
  { id: 6, title: 'Développeuse Frontend', company: 'Ill Valley Tech', summary: "Construisez des interfaces React pour notre solution de gestion de projet utilisée par 200 entreprises.", lat: 48.5333, lng: 7.7167 },
  { id: 7, title: 'Technicien support informatique', company: 'Rhénacom', summary: "Assurez le support technique de premier niveau pour nos clients professionnels de la région.", lat: 48.5290, lng: 7.7200 },
  { id: 8, title: 'Comptable', company: 'Vosges Software', summary: "Gérez la comptabilité générale d'une entreprise de développement logiciel de 25 personnes.", lat: 48.6050, lng: 7.7510 },
  { id: 9, title: 'Chef de projet digital', company: 'EuroRhin Systems', summary: "Coordonnez nos projets clients de la conception au déploiement, en lien avec les équipes techniques.", lat: 48.6020, lng: 7.7480 },
  { id: 10, title: 'Vendeur en magasin', company: 'Maison Fischer', summary: "Rejoignez notre équipe de vente dans notre boutique du centre-ville de Haguenau.", lat: 48.8167, lng: 7.7833 },
  { id: 11, title: 'Product Owner', company: 'Cathédrale Data', summary: "Définissez la roadmap produit de notre solution SaaS destinée aux collectivités locales.", lat: 48.8140, lng: 7.7900 },
  { id: 12, title: 'Designer UX/UI', company: 'Alsatech', summary: "Concevez des interfaces intuitives pour nos applications métier, du wireframe au prototype final.", lat: 48.0794, lng: 7.3585 },
  { id: 13, title: 'Ingénieur DevOps', company: 'NovaRhin', summary: "Automatisez et fiabilisez nos pipelines de déploiement sur infrastructure cloud souveraine.", lat: 48.0750, lng: 7.3620 },
  { id: 14, title: 'Administrateur systèmes', company: 'Strasnet Solutions', summary: "Maintenez et sécurisez les serveurs de nos clients, avec astreinte technique ponctuelle.", lat: 47.7508, lng: 7.3359 },
  { id: 15, title: 'Responsable logistique', company: 'Manufacture du Rhin', summary: "Organisez les flux logistiques de notre site de production mulhousien.", lat: 47.7460, lng: 7.3400 },
  { id: 16, title: 'Consultant SAP', company: 'EuroRhin Systems', summary: "Accompagnez nos clients industriels dans le déploiement de modules SAP sur mesure.", lat: 48.2603, lng: 7.4547 },
  { id: 17, title: 'Développeur mobile', company: 'Cigogne Digital', summary: "Développez notre application mobile React Native utilisée par plus de 50 000 utilisateurs.", lat: 48.7406, lng: 7.3622 },
  { id: 18, title: 'Chargé de clientèle', company: 'Rhénacom', summary: "Assurez le suivi et la satisfaction de notre portefeuille de clients professionnels.", lat: 48.4667, lng: 7.4833 },
  { id: 19, title: 'Technicien de maintenance', company: 'Manufacture du Rhin', summary: "Intervenez sur les équipements industriels de notre site de production, en horaires d'équipe.", lat: 48.5333, lng: 7.5000 },
  { id: 20, title: 'Ingénieur DevOps', company: 'Informatique', summary: "Rejoignez notre équipe infrastructure pour fiabiliser nos plateformes clients à fort trafic.", lat: 48.8566, lng: 2.3522 },
  { id: 21, title: 'Développeur Backend', company: 'Valley Tech', summary: "Concevez les services backend de notre marketplace B2B, en environnement microservices.", lat: 45.7640, lng: 4.8357 },
  { id: 22, title: 'Data Analyst', company: 'Software', summary: "Exploitez les données d'usage de nos produits pour orienter nos décisions produit.", lat: 43.2965, lng: 5.3698 },
]

export default mockListings