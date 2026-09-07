# GéoEmploi — État du prototype

*Document rédigé pour le passage télévisé du 3 septembre 2026.*

## Ce qui fonctionne aujourd'hui

- **Carte interactive** : consultation libre, sans compte, des offres d'emploi géolocalisées. Fond de carte officiel (Géoplateforme IGN).
- **Localisation** : la carte se centre automatiquement sur la position de l'utilisateur s'il l'autorise. En cas de refus, une recherche manuelle par ville est proposée — l'application reste utilisable dans les deux cas.
- **Fiches d'offres** : chaque point sur la carte affiche le poste concerné au clic.
- **Carte limitée au territoire** : impossible de faire défiler la carte en dehors de la France (plus de zone grise ou de doublons visuels).
- **Écran de création de compte** : formulaire d'inscription visible, avec choix entre profil candidat et profil employeur, et validation des champs saisis.
- **Pages d'erreur** : une page dédiée s'affiche si l'utilisateur se perd (page introuvable) ou si une erreur technique survient, plutôt qu'un écran cassé.
- **Charte graphique ministérielle** : couleurs, typographies et bloc-marque appliqués sur l'ensemble des écrans ci-dessus.

## Ce qui n'est pas encore fait

- **Connexion à la base de données réelle** : l'application affiche actuellement des données d'exemple. Le raccordement à la base de données de production est en cours par l'équipe backend.
- **Création de compte réelle** : le formulaire s'affiche et se valide, mais aucun compte n'est encore réellement enregistré — la soumission ne fait rien de permanent tant que le raccordement à la base de données n'est pas fait.
- **Candidature à une offre** : le parcours de candidature complet (envoi du profil à l'employeur) n'est pas encore construit.
- **Tableau de bord employeur** : le suivi des candidatures reçues par les entreprises n'existe pas encore.
- **Panneau d'administration** : la modération des offres n'est pas encore construite.

## La semaine prochaine

- Raccordement complet à la base de données et aux offres réelles.
- Construction du parcours de candidature.
- Tableau de bord employeur et panneau d'administration.
- Audit d'accessibilité et mise en conformité RGAA.

---

*Contact : Bassirou — équipe GéoEmploi*