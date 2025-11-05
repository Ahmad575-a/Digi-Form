#!/usr/bin/env bash
set -euo pipefail

python manage.py migrate --noinput

if [ "${DJANGO_DEBUG:-False}" = "True" ]; then
  python manage.py shell -c "from django.contrib.auth import get_user_model; U=get_user_model(); \
u='admin'; p='admin12345'; (U.objects.filter(username=u).exists() or U.objects.create_superuser(u,'admin@example.com',p))"
fi

gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 3