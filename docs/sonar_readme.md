# SonarQube — Local Setup & Usage

This project uses a **self-hosted SonarQube Community Edition** instance, run locally via Docker, for code quality analysis (Go backend + React/TS frontend).

## 1. Start SonarQube

```bash
docker compose -f setup/sonarqube-docker-compose.yml up -d
```

Check it's healthy:

```bash
docker logs setup-sonarqube-1 --tail 20
```

Look for a line confirming SonarQube is operational, then open:

```
http://localhost:9000
```

Default login: `admin` / `admin` (you'll be forced to set a new password on first login).

## 2. Project & token (one-time setup)

1. In the UI: **Projects → Create Project → Manually (local project)**.
   - We do **not** use "import from GitHub" — that requires a paid DevOps Platform integration. We push analysis results from a locally-run scanner instead, regardless of where the code is hosted.
2. Project key: `Survivor` (must match `sonar.projectKey` in `sonar-project.properties` **exactly**, including case).
3. Generate an analysis token: **My Account → Security → Generate Token**.
   - Save it somewhere safe — you won't be able to see it again.
   - Never commit it. Export it locally instead:
     ```bash
     export SONAR_TOKEN="<your_token>"
     ```

## 3. Configuration file

`sonar-project.properties` lives at the repo root:

```properties
sonar.projectKey=Survivor
sonar.projectName=Survivor
sonar.sources=backend,frontend
sonar.exclusions=**/node_modules/**,**/*_test.go,**/dist/**,**/vendor/**

sonar.tests=.
sonar.test.inclusions=**/*_test.go

sonar.go.coverage.reportPaths=backend/coverage.out
sonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info
```

## 4. Run a scan

From the repo root:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -e SONAR_HOST_URL="http://host.docker.internal:9000" \
  -e SONAR_TOKEN="$SONAR_TOKEN" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli
```

> **Why `--add-host`:** on native Linux Docker (unlike Docker Desktop on Mac/Windows), `host.docker.internal` doesn't resolve to the host by default. This flag maps it explicitly so the scanner container can reach the SonarQube container running on the host.

## 5. View results

Refresh the project page at `http://localhost:9000` — you'll see bugs, code smells, vulnerabilities, duplication, and the quality gate status.

## Notes / TODO

- Coverage reports (`backend/coverage.out`, `frontend/coverage/lcov.info`) aren't generated yet — until tests exist, you'll see a harmless "report file not found" warning during the scan.
- `backend-docker-compose.yml` / `frontend-docker-compose.yml` currently need their own Dockerfiles before those services can run — not required for SonarQube itself, which only reads source files off disk.
- Consider agreeing on a quality gate (default is "Sonar way") as a team.
- Possible next step: wire this into GitHub Actions so scans run automatically on push/PR instead of manually.