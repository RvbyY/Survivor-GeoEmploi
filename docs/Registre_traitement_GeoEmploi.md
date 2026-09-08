# Fiche de registre de traitement - GeoEmploi

## 1. Identification du traitement

| Champ | Information |
| --- | --- |
| Nom du traitement | Gestion de la plateforme GeoEmploi et recherche d'offres d'emploi localisees |
| Responsable du traitement | A completer par l'organisme qui exploite GeoEmploi |
| Coordonnees du responsable | A completer |
| Delegue a la protection des donnees (DPO) | A completer, ou indiquer « non applicable » avec justification |
| Date de creation de la fiche | 04/09/2026 |
| Version | 1.0 |
| Perimetre | Frontend React, API Go, base PostgreSQL et services externes declares dans le projet |
| Statut | Fiche initiale a valider juridiquement et techniquement |

Cette fiche suit les informations attendues par la [CNIL pour un registre des activites de traitement](https://www.cnil.fr/fr/registre-des-activites-de-traitement). Elle est basee sur une revue du code et ne remplace pas la validation du responsable du traitement.

## 2. Finalites du traitement

- Creer et gerer les comptes des candidats et des employeurs.
- Identifier les utilisateurs et permettre l'acces aux fonctionnalites de la plateforme.
- Publier et afficher des offres d'emploi.
- Rechercher des offres selon une ville ou une position geographique.
- Convertir une ville saisie en coordonnees afin de centrer la carte et proposer des resultats locaux.
- Administrer la base de donnees et assurer le fonctionnement technique du service.

La gestion des candidatures est prevue dans le modele de donnees mais n'est pas implementee dans le code actuellement observee. Elle ne doit pas etre declaree comme un traitement operationnel avant sa mise en production.

## 3. Base legale

| Sous-traitement | Base legale a confirmer |
| --- | --- |
| Creation et gestion du compte | Execution du contrat ou mesures precontractuelles, si le compte est necessaire au service |
| Recherche par ville | Execution du service demande par l'utilisateur |
| Geolocalisation precise du navigateur | Consentement de l'utilisateur pour l'acces a la position, puis execution de la fonctionnalite demandee |
| Publication et consultation des offres | Execution du contrat ou interet legitime, selon le modele de service |
| Securite, maintenance et exploitation | Interet legitime ou obligation legale, a documenter |
| Candidatures | Non applicable a ce stade : fonctionnalite non implementee |

Les bases legales ci-dessus sont des hypotheses de qualification et doivent etre confirmees par le responsable du traitement. Le consentement de geolocalisation doit pouvoir etre refuse et retire sans bloquer les autres modes de recherche.

## 4. Personnes concernees

- Candidats et visiteurs utilisant la recherche d'offres.
- Employeurs ou representants d'employeurs creant un compte ou publiant une offre.
- Administrateurs et personnes habilitees a exploiter la plateforme, si ce role est cree.

## 5. Categories de donnees traitees

### Donnees d'identification et de contact

- Identifiant utilisateur technique.
- Nom ou nom complet.
- Nom de l'entreprise pour un compte employeur.
- Adresse e-mail.
- Type de compte et mode d'utilisation (candidat/employeur, connexion/inscription).

### Donnees de connexion

- Mot de passe saisi dans l'interface d'inscription ou de connexion.

**Point important :** le frontend journalise actuellement l'objet du formulaire dans la console, ce qui peut exposer le mot de passe dans les outils du navigateur ou des journaux de session. Cette journalisation doit etre supprimee avant toute mise en production. Le code actuel ne montre pas de stockage ou d'envoi fonctionnel du mot de passe au backend.

### Donnees de localisation

- Ville ou adresse saisie pour la recherche.
- Latitude et longitude issues de la geolocalisation du navigateur, lorsque l'utilisateur l'autorise.
- Latitude, longitude et distance maximale associees a la recherche ou aux offres, selon le flux utilise.

La position precise est une donnee potentiellement sensible au regard de la vie privee. Il faut privilegier la precision strictement necessaire et eviter sa conservation lorsqu'elle n'est pas indispensable.

### Donnees relatives aux offres

- Intitule de l'offre.
- Nom de l'entreprise.
- Identifiant du compte employeur associe.
- Remuneration.
- Coordonnees geographiques.
- Date de publication.
- Distance maximale.

### Donnees de candidature

Le schema contient des identifiants de candidature, d'offre et de candidat. Aucun formulaire, endpoint ou enregistrement de candidature n'est actuellement implemente. Les CV, lettres de motivation et statuts de candidature ne sont donc pas declares comme collectes dans cette version.

## 6. Origine des donnees

- Saisie directe par l'utilisateur dans les formulaires.
- Autorisation fournie au navigateur pour la position geographique.
- Donnees d'offres saisies par un employeur ou presentes dans les donnees de demonstration.
- Donnees techniques produites par l'hebergement, la base de donnees et les requetes HTTP.

## 7. Destinataires et sous-traitants

| Destinataire ou service | Donnees potentiellement transmises | Role / verification requise |
| --- | --- | --- |
| Personnel habilite de l'exploitant | Donnees necessaires a l'administration | Definir les roles et les droits d'acces |
| PostgreSQL heberge | Comptes, offres et relations enregistrees | Documenter l'hebergeur, les acces, les sauvegardes et la localisation |
| `api-adresse.data.gouv.fr` | Ville ou adresse saisie, requete technique | Verifier les conditions du service, la conservation et l'information utilisateur |
| IGN / Géoportail | Requetes de tuiles cartographiques et metadonnees techniques | Verifier les conditions d'utilisation, la conservation et les transferts |
| Google Fonts et CDN Leaflet | Requetes de ressources web et metadonnees techniques | Preferer l'hebergement local ou documenter les flux et la base legale |

La liste des sous-traitants, leurs contrats et les eventuels transferts hors EEE doivent etre completes par l'exploitant. Aucun transfert international ou mecanisme de garantie n'est documente dans le depot.

## 8. Duree de conservation

Les durees ne sont pas definies dans le code. Les durees suivantes sont donc des propositions a valider, et non des durees juridiquement arretees :

| Donnee | Duree cible a definir | Regle de suppression a implementer |
| --- | --- | --- |
| Compte candidat ou employeur | Duree de vie du compte, puis suppression ou anonymisation apres une periode d'inactivite a definir | Procedure de suppression et confirmation utilisateur |
| Offres d'emploi | Duree de publication, puis archivage ou suppression selon la finalite | Statut, date d'expiration et purge automatique |
| Position precise | Le temps strictement necessaire a la recherche | Ne pas la conserver par defaut |
| Ville saisie et requetes de geocodage | Duree strictement necessaire au retour du resultat | Ne pas conserver dans l'application sans besoin documente |
| Candidatures | Non applicable dans la version actuelle | A definir avant implementation |
| Journaux techniques | Duree courte a definir selon la securite et l'exploitation | Politique de logs, acces restreint et purge |

## 9. Mesures de securite observees et a mettre en oeuvre

### Mesures observees

- Utilisation de requetes SQL parametrees dans les handlers consultes.
- Validation de certaines donnees du formulaire frontend.
- Utilisation d'HTTPS pour les URLs externes declarees dans le frontend.
- Attribution IGN affichee sur la carte.

### Mesures manquantes ou a verifier

- Retirer les identifiants de base de donnees codes en dur et utiliser uniquement des secrets d'environnement.
- Ne pas utiliser `sslmode=disable` en production ; imposer le chiffrement de la connexion a la base.
- Supprimer toute journalisation du mot de passe et des donnees personnelles.
- Ajouter authentification, autorisation par role et verification de propriete sur les endpoints utilisateurs et offres.
- Restreindre l'endpoint qui retourne tous les utilisateurs, notamment les adresses e-mail.
- Documenter le chiffrement, les sauvegardes, la restauration, la gestion des secrets et la journalisation des acces.
- Ajouter une politique de suppression, de minimisation et de gestion des incidents.
- Limiter la precision et la duree de conservation des donnees de localisation.

## 10. Droits des personnes et information

Les utilisateurs doivent etre informes au moment de la collecte et pouvoir exercer, selon le cas, leurs droits d'acces, de rectification, d'effacement, de limitation, d'opposition, de portabilite et de retrait du consentement pour la geolocalisation.

Les elements suivants ne sont pas identifies dans le depot et restent a ajouter ou a documenter :

- notice de confidentialite accessible depuis chaque formulaire ;
- identite et coordonnees du responsable du traitement et du DPO ;
- procedure et adresse de contact pour les demandes de droits ;
- information specifique sur la geolocalisation et le service de geocodage ;
- information sur les destinataires et les durees de conservation ;
- mecanisme de suppression de compte et de retrait de la position.

## 11. Traitements non encore operationnels

Le modele SQL prevoit des utilisateurs, des offres et des candidatures, mais la revue du code montre que :

- l'authentification est encore simulee en memoire dans le frontend ;
- l'ajout d'offres n'est pas implemente dans le handler observe ;
- les candidatures n'ont pas encore d'API, d'interface ou de persistance fonctionnelle ;
- les offres affichees par le frontend sont actuellement des donnees fictives de demonstration.

Ces points doivent etre reevaluaes a chaque evolution du produit et la fiche doit etre mise a jour avant l'ouverture de nouvelles collectes.

## 12. Sources et pieces de verification

- [CNIL - Registre des activites de traitement](https://www.cnil.fr/fr/registre-des-activites-de-traitement)
- [Schema de base de donnees](../GeoEmploiDB.sql)
- [API et acces utilisateurs](../backend/main.go)
- [Gestion des offres](../backend/handlers/offers.go)
- [Formulaire de connexion](../frontend/src/pages/Login.tsx)
- [Geolocalisation et recherche](../frontend/src/pages/Home.tsx)
- [Geocodage](../frontend/src/api/geocode.ts)
- [Formulaire de ville](../frontend/src/components/Citysearchform.tsx)
- [Carte](../frontend/src/components/Map.tsx)

## Validation de la fiche

| Rôle | Nom | Date | Signature / validation |
| --- | --- | --- | --- |
| Responsable du traitement | A completer | A completer | A completer |
| DPO | A completer | A completer | A completer |
| Responsable technique | A completer | A completer | A completer |