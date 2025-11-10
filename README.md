# Digi-Form

## Tech Stack
Built with **Django**, **MySQL**, and **React (TypeScript)** using Docker.

---

## Quick Start

```bash
git clone https://github.com/Ahmad575-a/Digi-Form.git
cd Digi-Form
cp .env.example .env
docker compose up --build
````

**Backend:** [http://localhost:8000](http://localhost:8000)
**Frontend:** [http://localhost:5173](http://localhost:5173)
**Health Check:** [http://localhost:8000/health/](http://localhost:8000/health/)

---

## Backend Commands

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

**Default development superuser:**
`admin / admin12345`

---

## Git Flow

Branch structure: **Feature → Development → BugFix → Main**

### Main branches

* **main**: production-ready code
* **development**: integration branch for ongoing work

### Supporting branches

* **FT/<branch_name>**: new features
* **BF/<branch_name>**: bug fixes


