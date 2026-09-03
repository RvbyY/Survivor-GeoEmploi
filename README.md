# GéoEmploi — Démarrer à partir du build

Ce dossier contient le résultat du build automatique (artefact GitHub Actions) :

```
dist-package/
├── frontend/     ← fichiers statiques (HTML/CSS/JS), prêts à être servis
├── server        ← binaire backend compilé (Go)
└── .env.example  ← variables d'environnement attendues par le backend
```

Aucune installation de dépendances n'est nécessaire — tout est déjà compilé.

## 1. Démarrer le frontend

Le dossier `frontend/` contient uniquement des fichiers statiques : il faut un serveur pour les servir.

**Avec Python (déjà installé sur la plupart des systèmes) :**
```bash
cd frontend
python3 -m http.server 3000
```

**Ou avec Node, si disponible :**
```bash
cd frontend
npx serve -l 3000
```

**Si ni Python ni Node ne sont installés :** installer Python rapidement (`sudo apt install python3` sur Ubuntu/Debian, ou télécharger depuis [python.org](https://www.python.org/downloads/) sur Windows/Mac), puis utiliser la commande ci-dessus. C'est l'option la plus simple à installer dans l'urgence, la plupart des systèmes l'ayant déjà.

Ouvrir ensuite `http://localhost:3000` dans un navigateur.

> À ce jour, le frontend fonctionne de manière autonome avec des données d'exemple (offres fictives autour de Strasbourg). Il n'a donc pas besoin que le backend tourne pour être consulté et démontré.

## 2. Démarrer le backend (optionnel)

Le backend nécessite une base de données PostgreSQL accessible.

```bash
cp .env.example .env
# éditer .env avec les identifiants de la base de données réelle
./server
```

Si aucune base de données n'est accessible, le backend affichera une erreur de connexion au démarrage (`connection refused`) — c'est attendu tant qu'aucune base n'est configurée.

## Dépannage rapide

| Symptôme | Cause probable |
|---|---|
| Page blanche sur `localhost:3000` | Le serveur de fichiers statiques n'a pas démarré, ou un autre service occupe déjà le port 3000. |
| `connection refused` au lancement de `./server` | Aucune base PostgreSQL n'est démarrée ou accessible à l'adresse indiquée dans `.env`. |
| `permission denied` sur `./server` | Ajouter les droits d'exécution : `chmod +x server`. |

---

*Artefact généré automatiquement par le workflow GitHub Actions à chaque push sur la branche principale.*