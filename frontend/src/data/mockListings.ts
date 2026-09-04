export type Listing = {
  id: number
  title: string
  company: string
  description: string
  lat: number
  lng: number
}

const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Développeur Backend',
    company: 'Alsatech',
    description:
      "Alsatech recherche un développeur backend pour renforcer l'équipe technique en charge de sa plateforme de gestion de flotte. Vous concevrez et maintiendrez des APIs REST en Go, en veillant à leur performance et à leur fiabilité, et travaillerez au quotidien avec PostgreSQL pour la modélisation et l'optimisation des données. Vous participerez également aux revues de code, à l'écriture de tests automatisés et à l'amélioration continue de l'architecture existante, en collaboration étroite avec les équipes produit et frontend.",
    lat: 48.5734,
    lng: 7.7521,
  },
  {
    id: 2,
    title: 'Chargée de communication',
    company: 'Cigogne Digital',
    description:
      "Cigogne Digital, agence en pleine croissance, recrute une chargée de communication pour piloter sa stratégie digitale. Vous serez responsable de la ligne éditoriale sur les réseaux sociaux, de la création de contenus (visuels, vidéos courtes, newsletters) et du suivi des performances des campagnes. Vous collaborerez avec les équipes design et commerciales pour aligner la communication sur les objectifs de croissance de l'agence, et assurerez une veille active sur les tendances du secteur.",
    lat: 48.5820,
    lng: 7.7455,
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'NovaRhin',
    description:
      "NovaRhin accompagne des clients industriels dans l'optimisation de leurs chaînes de production et recherche un data analyst pour renforcer son équipe data. Vous collecterez, nettoierez et analyserez des données de production afin d'identifier des leviers d'amélioration opérationnelle, et présenterez vos conclusions sous forme de tableaux de bord clairs et exploitables. Une bonne maîtrise de SQL et d'un outil de visualisation (Power BI ou équivalent) est attendue, ainsi qu'un goût prononcé pour le travail en environnement industriel.",
    lat: 48.5850,
    lng: 7.7590,
  },
  {
    id: 4,
    title: 'Assistant RH',
    company: 'Kleber Informatique',
    description:
      "Kleber Informatique, PME de 40 personnes spécialisée dans les solutions logicielles, recherche un assistant RH pour accompagner le recrutement et l'intégration des nouveaux collaborateurs. Vous participerez à la rédaction et à la diffusion des offres d'emploi, au tri des candidatures, à l'organisation des entretiens et à la mise en place des parcours d'onboarding. Vous assisterez également l'équipe RH dans la gestion administrative courante et le suivi de la vie des contrats.",
    lat: 48.5789,
    lng: 7.7460,
  },
  {
    id: 5,
    title: 'Ingénieur réseau',
    company: 'Strasnet Solutions',
    description:
      "Strasnet Solutions recherche un ingénieur réseau pour administrer et sécuriser l'infrastructure réseau de ses clients professionnels en Alsace. Vous interviendrez sur le déploiement, la configuration et la supervision d'équipements réseau (routeurs, switchs, pare-feux), et serez en charge du diagnostic et de la résolution des incidents. Une expertise sur les protocoles réseau standards et une sensibilité forte à la cybersécurité sont indispensables pour ce poste.",
    lat: 48.5701,
    lng: 7.7633,
  },
  {
    id: 6,
    title: 'Développeuse Frontend',
    company: 'Ill Valley Tech',
    description:
      "Ill Valley Tech développe une solution de gestion de projet utilisée par plus de 200 entreprises et recherche une développeuse frontend pour enrichir son produit. Vous construirez des interfaces en React, en veillant à l'accessibilité, à la performance et à la cohérence visuelle de l'application. Vous travaillerez en étroite collaboration avec les designers UX/UI et les développeurs backend au sein d'une équipe agile, avec des cycles de livraison courts et réguliers.",
    lat: 48.5333,
    lng: 7.7167,
  },
  {
    id: 7,
    title: 'Technicien support informatique',
    company: 'Rhénacom',
    description:
      "Rhénacom recherche un technicien support informatique pour assurer le support technique de premier niveau auprès de ses clients professionnels de la région. Vous prendrez en charge les demandes d'assistance par téléphone et à distance, diagnostiquerez les incidents matériels et logiciels, et escaladerez les cas complexes vers les équipes spécialisées. Un bon relationnel client et une rigueur dans le suivi des tickets sont essentiels pour réussir dans ce poste.",
    lat: 48.5290,
    lng: 7.7200,
  },
  {
    id: 8,
    title: 'Comptable',
    company: 'Vosges Software',
    description:
      "Vosges Software, entreprise de développement logiciel de 25 personnes, recherche un comptable pour gérer sa comptabilité générale. Vous serez en charge de la saisie et du suivi des écritures comptables, du rapprochement bancaire, de la préparation des déclarations fiscales et de l'assistance à la clôture des comptes annuels en lien avec l'expert-comptable. Vous travaillerez en collaboration directe avec la direction financière de l'entreprise.",
    lat: 48.6050,
    lng: 7.7510,
  },
  {
    id: 9,
    title: 'Chef de projet digital',
    company: 'EuroRhin Systems',
    description:
      "EuroRhin Systems recherche un chef de projet digital pour coordonner ses projets clients de la conception au déploiement. Vous serez l'interlocuteur privilégié des clients, traduirez leurs besoins en spécifications fonctionnelles, et piloterez les équipes techniques internes pour garantir le respect des délais, du budget et de la qualité. Une expérience en gestion de projet agile et de bonnes compétences en communication sont fortement appréciées.",
    lat: 48.6020,
    lng: 7.7480,
  },
  {
    id: 10,
    title: 'Vendeur en magasin',
    company: 'Maison Fischer',
    description:
      "Maison Fischer recrute un vendeur pour rejoindre son équipe dans sa boutique du centre-ville de Haguenau. Vous accueillerez et conseillerez la clientèle, participerez à la mise en valeur des produits en rayon, et contribuerez à la bonne tenue du magasin au quotidien. Le sens du service, l'aisance relationnelle et le goût du commerce sont des qualités essentielles pour ce poste.",
    lat: 48.8167,
    lng: 7.7833,
  },
  {
    id: 11,
    title: 'Product Owner',
    company: 'Cathédrale Data',
    description:
      "Cathédrale Data recherche un product owner pour définir la roadmap de sa solution SaaS destinée aux collectivités locales. Vous recueillerez les besoins des utilisateurs et des parties prenantes, rédigerez les user stories, et prioriserez le backlog en lien avec les équipes de développement. Vous jouerez un rôle clé dans les cérémonies agiles et dans la démonstration régulière des fonctionnalités livrées aux clients.",
    lat: 48.8140,
    lng: 7.7900,
  },
  {
    id: 12,
    title: 'Designer UX/UI',
    company: 'Alsatech',
    description:
      "Alsatech recherche un designer UX/UI pour concevoir des interfaces intuitives destinées à ses applications métier. Vous mènerez des recherches utilisateurs, réaliserez des wireframes puis des prototypes interactifs, et travaillerez en étroite collaboration avec les développeurs pour garantir une intégration fidèle de vos maquettes. La maîtrise d'outils tels que Figma et une sensibilité forte à l'ergonomie sont attendues.",
    lat: 48.0794,
    lng: 7.3585,
  },
  {
    id: 13,
    title: 'Ingénieur DevOps',
    company: 'NovaRhin',
    description:
      "NovaRhin recherche un ingénieur DevOps pour automatiser et fiabiliser ses pipelines de déploiement sur infrastructure cloud souveraine. Vous mettrez en place des chaînes d'intégration et de déploiement continu, superviserez la performance des environnements de production, et contribuerez à l'amélioration des pratiques d'infrastructure as code au sein de l'équipe technique. Une bonne connaissance de Docker, Kubernetes et des outils CI/CD est requise.",
    lat: 48.0750,
    lng: 7.3620,
  },
  {
    id: 14,
    title: 'Administrateur systèmes',
    company: 'Strasnet Solutions',
    description:
      "Strasnet Solutions recherche un administrateur systèmes pour maintenir et sécuriser les serveurs de ses clients. Vous assurerez la supervision, les mises à jour et les sauvegardes des infrastructures, interviendrez en cas d'incident, et participerez à une astreinte technique ponctuelle en dehors des horaires classiques. Une bonne maîtrise des environnements Linux et Windows Server est indispensable pour ce poste.",
    lat: 47.7508,
    lng: 7.3359,
  },
  {
    id: 15,
    title: 'Responsable logistique',
    company: 'Manufacture du Rhin',
    description:
      "Manufacture du Rhin recherche un responsable logistique pour organiser les flux logistiques de son site de production mulhousien. Vous piloterez la gestion des stocks, la réception et l'expédition des marchandises, et coordonnerez les équipes d'entrepôt pour garantir le respect des délais de production. Une expérience en gestion de la chaîne logistique dans un environnement industriel est un atout majeur.",
    lat: 47.7460,
    lng: 7.3400,
  },
  {
    id: 16,
    title: 'Consultant SAP',
    company: 'EuroRhin Systems',
    description:
      "EuroRhin Systems recherche un consultant SAP pour accompagner ses clients industriels dans le déploiement de modules SAP sur mesure. Vous analyserez les besoins métier, paramétrerez les modules concernés, et assurerez la formation ainsi que le support des utilisateurs finaux lors de la mise en production. Une expérience confirmée sur au moins un module SAP (FI/CO, MM ou SD) est requise.",
    lat: 48.2603,
    lng: 7.4547,
  },
  {
    id: 17,
    title: 'Développeur mobile',
    company: 'Cigogne Digital',
    description:
      "Cigogne Digital recherche un développeur mobile pour faire évoluer son application React Native utilisée par plus de 50 000 utilisateurs. Vous développerez de nouvelles fonctionnalités, optimiserez les performances de l'application sur iOS et Android, et travaillerez en étroite collaboration avec l'équipe backend pour l'intégration des APIs. Une attention particulière sera portée à la qualité de l'expérience utilisateur et à la stabilité de l'application.",
    lat: 48.7406,
    lng: 7.3622,
  },
  {
    id: 18,
    title: 'Chargé de clientèle',
    company: 'Rhénacom',
    description:
      "Rhénacom recherche un chargé de clientèle pour assurer le suivi et la satisfaction de son portefeuille de clients professionnels. Vous serez l'interlocuteur privilégié des clients au quotidien, traiterez leurs demandes et réclamations, et identifierez des opportunités de développement commercial au sein de votre portefeuille. Une forte orientation client et de bonnes capacités de négociation sont attendues.",
    lat: 48.4667,
    lng: 7.4833,
  },
  {
    id: 19,
    title: 'Technicien de maintenance',
    company: 'Manufacture du Rhin',
    description:
      "Manufacture du Rhin recherche un technicien de maintenance pour intervenir sur les équipements industriels de son site de production, en horaires d'équipe. Vous assurerez la maintenance préventive et corrective des machines, diagnostiquerez les pannes et interviendrez rapidement pour limiter les arrêts de production. Une formation en électromécanique ou maintenance industrielle est souhaitée.",
    lat: 48.5333,
    lng: 7.5000,
  },
  {
    id: 20,
    title: 'Ingénieur DevOps',
    company: 'Informatique',
    description:
      "Cette entreprise parisienne recherche un ingénieur DevOps pour rejoindre son équipe infrastructure et fiabiliser ses plateformes clients à fort trafic. Vous concevrez et maintiendrez des pipelines de déploiement automatisés, superviserez la disponibilité des services en production, et participerez à la définition des standards d'infrastructure cloud de l'entreprise. Une expérience solide sur AWS ou GCP ainsi que sur les outils d'orchestration de conteneurs est attendue.",
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: 21,
    title: 'Développeur Backend',
    company: 'Valley Tech',
    description:
      "Valley Tech recherche un développeur backend pour concevoir les services de sa marketplace B2B, dans un environnement microservices. Vous participerez à la conception, au développement et à la maintenance d'APIs performantes, et collaborerez avec les équipes produit pour livrer des fonctionnalités répondant aux besoins des professionnels utilisateurs de la plateforme. Une bonne connaissance des architectures distribuées est un plus.",
    lat: 45.7640,
    lng: 4.8357,
  },
  {
    id: 22,
    title: 'Data Analyst',
    company: 'Software',
    description:
      "Cette entreprise marseillaise recherche un data analyst pour exploiter les données d'usage de ses produits et orienter les décisions produit. Vous construirez des tableaux de bord de suivi, mènerez des analyses ad hoc pour répondre aux questions des équipes produit et marketing, et contribuerez à la mise en place d'une culture data au sein de l'entreprise. La maîtrise de SQL et d'un langage comme Python est appréciée.",
    lat: 43.2965,
    lng: 5.3698,
  },
]

export default mockListings