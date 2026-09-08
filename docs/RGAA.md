# Controle RGAA - GeoEmploi

Ce document controle 10 criteres du [referentiel officiel RGAA 4.1.2](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/), selectionnes en fonction des composants presents dans GeoEmploi.

Le controle est une revue statique du code frontend. Il ne remplace pas les tests manuels avec un lecteur d'ecran, la navigation au clavier, ni la verification du contraste avec un outil dedie.

## Synthese

| Critere | Theme | Etat dans le code |
| --- | --- | --- |
| 1.1 | Images | Partiel |
| 1.2 | Images decoratives | Conforme sur le logo observe |
| 3.2 | Contraste texte | A verifier |
| 6.2 | Intitule des liens | Non verifie |
| 8.3 | Langue par defaut | Non conforme |
| 8.5 | Titre de page | Partiel |
| 9.1 | Titres | Partiel |
| 10.7 | Focus visible | Partiel |
| 11.1 | Etiquettes de champs | Partiel |
| 11.10 | Controle de saisie | Partiel |

## Detail des criteres

### 1.1 - Chaque image porteuse d'information a-t-elle une alternative textuelle ?

- **Etat :** Partiel.
- **Constat :** `Brandblock.tsx` fournit `alt=""` pour un pictogramme traite comme decoratif, ce qui est adapte si le texte voisin porte deja le nom de la marque. En revanche, les marqueurs SVG crees dans `Map.tsx` n'ont pas de nom ou d'alternative accessible. La carte ne propose pas non plus de liste textuelle equivalente aux offres.
- **Fichiers :** `frontend/src/components/Brandblock.tsx`, `frontend/src/components/Map.tsx`.
- **Action :** donner un nom accessible aux images informatives et fournir une alternative textuelle aux informations essentielles de la carte.

### 1.2 - Chaque image de decoration est-elle correctement ignoree par les technologies d'assistance ?

- **Etat :** Conforme pour le cas observe.
- **Constat :** le pictogramme de `Brandblock.tsx` utilise `alt=""`, ce qui permet de l'ignorer lorsqu'il est purement decoratif.
- **Fichier :** `frontend/src/components/Brandblock.tsx`.
- **Point de vigilance :** reevaluer ce choix si le pictogramme apporte une information qui n'est pas deja donnee par le texte.

### 3.2 - Le contraste entre la couleur du texte et celle de l'arriere-plan est-il suffisamment eleve ?

- **Etat :** A verifier.
- **Constat :** la feuille de style contient des textes secondaires en `#7c8698` et `#4a5570`, ainsi que des textes de petite taille. Le contraste reel depend des fonds associes et doit etre mesure.
- **Fichiers :** `frontend/src/Auth.css`, `frontend/src/App.css`, `frontend/src/index.css`.
- **Action :** mesurer les couples texte/fond avec un outil de contraste et renforcer les couleurs insuffisantes.

### 6.2 - Dans chaque page web, chaque lien a-t-il un intitule ?

- **Etat :** Non verifie.
- **Constat :** les composants consultes utilisent principalement des boutons et la presence de liens doit etre controlee sur toutes les pages. Chaque lien doit avoir un nom accessible et explicite, y compris s'il est compose uniquement d'une icone.
- **Fichiers a controler :** `frontend/src/components/Header.tsx`, `frontend/src/pages/`.
- **Action :** verifier tous les elements `<a>` rendus et ajouter un texte visible ou un nom accessible pertinent lorsque necessaire.

### 8.3 - Dans chaque page web, la langue par defaut est-elle presente ?

- **Etat :** Non conforme.
- **Constat :** `frontend/index.html` declare `lang="en"`, alors que l'interface est redigee en francais.
- **Fichier :** `frontend/index.html`.
- **Action :** remplacer la valeur par `lang="fr"`.

### 8.5 - Chaque page web a-t-elle un titre de page ?

- **Etat :** Partiel.
- **Constat :** le document declare le titre global `GeoEmploi`. Les pages `/login`, `/500` et 404 ne semblent pas definir de titre specifique lors du changement de route.
- **Fichiers :** `frontend/index.html`, `frontend/src/pages/Login.tsx`, `frontend/src/pages/Notfound.tsx`, `frontend/src/pages/Servererror.tsx`.
- **Action :** definir un titre pertinent pour chaque vue, par exemple `Connexion - GeoEmploi` ou `Page introuvable - GeoEmploi`.

### 9.1 - L'information est-elle structuree par l'utilisation appropriee de titres ?

- **Etat :** Partiel.
- **Constat :** `Notfound.tsx` et `Servererror.tsx` utilisent un `<h1>`. En revanche, la page d'accueil et la page de connexion ne presentent pas de `<h1>` identifiable dans les composants consultes.
- **Fichiers :** `frontend/src/pages/Home.tsx`, `frontend/src/pages/Login.tsx`, `frontend/src/pages/Notfound.tsx`, `frontend/src/pages/Servererror.tsx`.
- **Action :** ajouter un titre principal unique et organiser les sous-sections avec une hierarchie de titres coherente.

### 10.7 - Pour chaque element recevant le focus, la prise de focus est-elle visible ?

- **Etat :** Partiel.
- **Constat :** des regles `:focus-visible` existent pour certains champs et le lien de fermeture. Aucun style explicite n'est observe pour plusieurs boutons d'interface, notamment les boutons de type de compte et les boutons principaux.
- **Fichiers :** `frontend/src/App.css`, `frontend/src/Auth.css`, `frontend/src/pages/Login.tsx`.
- **Action :** definir un indicateur `:focus-visible` clairement visible pour tous les controles interactifs et le tester au clavier.

### 11.1 - Chaque champ de formulaire a-t-il une etiquette ?

- **Etat :** Partiel.
- **Constat :** les champs de connexion sont inclus dans des `<label>`, ce qui les associe implicitement a leur texte. Le champ ville de `Citysearchform.tsx` n'a pas de `<label>` ; son `placeholder` ne constitue pas une etiquette.
- **Fichiers :** `frontend/src/pages/Login.tsx`, `frontend/src/components/Citysearchform.tsx`.
- **Action :** ajouter une etiquette visible associee au champ ville avec `htmlFor` et `id`.

### 11.10 - Le controle de saisie est-il utilise de maniere pertinente ?

- **Etat :** Partiel.
- **Constat :** `Login.tsx` utilise `noValidate`, desactive donc la validation native, et les champs ne declarent pas `required`. Les erreurs sont rendues dans une liste, mais ne sont pas associees aux champs et ne sont pas annoncees avec `role="alert"` ou `aria-live`. `Citysearchform.tsx` affiche une erreur visuelle sans annonce aux technologies d'assistance.
- **Fichiers :** `frontend/src/pages/Login.tsx`, `frontend/src/components/Citysearchform.tsx`.
- **Action :** conserver un controle cote serveur, ajouter les contraintes HTML pertinentes, associer les messages aux champs avec `aria-describedby`/`aria-invalid` et annoncer les erreurs.

## Conclusion

Le projet possede deja quelques bases utiles : elements HTML natifs pour les actions, labels englobants dans la connexion, et certains styles de focus. Les priorites identifiees par cette revue sont la correction de `lang`, l'ajout de titres de pages et de titres principaux, l'etiquetage du champ ville, l'accessibilite des erreurs et la fourniture d'une alternative textuelle a la carte.

Source : [Criteres et tests - RGAA](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/), version 4.1.2.