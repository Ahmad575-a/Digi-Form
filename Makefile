.PHONY: up down logs migrate makemigrations
up: ; docker compose up --build
down: ; docker compose down -v
logs: ; docker compose logs -f backend
migrate: ; docker compose exec backend python manage.py migrate
makemigrations: ; docker compose exec backend python manage.py makemigrations
