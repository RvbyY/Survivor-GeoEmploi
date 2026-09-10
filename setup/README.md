# Run GeoEmploi with Docker

From the repository root:

```bash
docker compose -f setup/docker-compose.yml up --build
```

Open the application at <http://localhost:5173>.

The services are:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:8080>
- PostgreSQL: available to the backend as `db:5432`

PostgreSQL data is stored in the `postgres_data` Docker volume. The SQL file is executed only when the database volume is created for the first time.

To stop the services:

```bash
docker compose -f setup/docker-compose.yml down
```

To reset the database and execute `GeoEmploiDB.sql` again:

```bash
docker compose -f setup/docker-compose.yml down -v
docker compose -f setup/docker-compose.yml up --build
```
