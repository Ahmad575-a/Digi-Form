#!/usr/bin/env bash
set -euo pipefail

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

gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 3