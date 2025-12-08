#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for database to be ready..."

python << 'EOF'
import os, time, socket

host = os.getenv("DJANGO_DB_HOST", "db")
port = int(os.getenv("DJANGO_DB_PORT", "3306"))

while True:
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"Database {host}:{port} is reachable.")
            break
    except OSError:
        print(f"Waiting for DB {host}:{port}...", flush=True)
        time.sleep(2)
EOF

echo "Running migrations..."

python manage.py makemigrations --noinput || true
python manage.py migrate --noinput || true

if [ "${DJANGO_DEBUG:-False}" = "True" ]; then
  python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
u, p = 'admin', 'admin12345';
if not User.objects.filter(username=u).exists():
    User.objects.create_superuser(u, 'admin@admin.com', p)
print('Superuser ready')
"
fi

echo "Starting gunicorn..."
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 3