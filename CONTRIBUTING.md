# Role distribution

|   **Role**    |   **Responsibility**  |   **Assigned**    |
|----------|---------------------|-------------------|
|   **Repo Maintainer** |   Owns the GitHub repository configuration, manages branch protection, CI, secrets, and the Epitech mirror |  Bassirou TALL |
|   **Back-end Owner**  |   Owner of `Restful API` development |    Sejun Park  |
|   **Front-end Owner** |   Owner of `Cartographic integration` development |   Esteban Munier  |

---


# Communication among the team

Communication between team members takes place on a private Discord chat
> [Ask to a group member to be add]

---

# Branch strategy

> All development happens on short-lived branches named after the feature or fix. When complete, the branch is merged into main via a pull request. main is always in a deployable state.

```zsh
main
 └── feat/backend/restfufAPi-check
 └── feat/frontend/move-by-clicking
 └── feat/setup/run-in-localmode
```

Good for: fast iteration, simple mental model.

---

# Commit convention

> The commit convention is already very common among developpers. It is a simple yet effective convention that tells everything that is needed.


|   **Convention**  |   **Example** |
|----------|---------------------|
| \<type>(\<scope>) : \<description> |  fix(backend): prevent crashing while logging by updating the `getUser` function |

- `<type>` : feat, fix, docs, chore, refactor, test, ci..
- `<scope>`: backend, frontend, docs, setup, ci...

# Review policy

> PR are manage by the repo manager. He should check each ones's to limit conflict between teams. He could allow another member to accept the request if he checked it before.

> It should be done on the same day, to keep a good pace in this project.
check if it works is mandatory but we shouldn't not take attention in code quality to keep the project easily maintanable.

# CI Pipeline

> It checks for each parts if all depencies are here, install them, build the project and for gui check if all tests run well.

/!\ Everything is mandatory !