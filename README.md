# GéoEmploi — Démarrer à partir du build

Ce dossier contient le résultat du build automatique (artefact GitHub Actions) :

```
dist-package/
├── frontend/     ← fichiers statiques (HTML/CSS/JS), prêts à être servis
├── server        ← binaire backend compilé (Go)
└── .env.example  ← variables d'environnement attendues par le backend
```

Aucune installation de dépendances n'est nécessaire — tout est déjà compilé.



# Commande pour démarrer le programme:

sudo docker compose -f setup/docker-compose.yml up --build