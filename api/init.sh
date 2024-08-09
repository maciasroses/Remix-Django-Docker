#!/bin/sh
set -e

host="${DB_HOST:-db}"
port="${DB_PORT:-5432}"

# Esperar hasta que la base de datos esté lista
until pg_isready -h "$host" -p "$port"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command from init.sh"

# Ejecutar migraciones
python manage.py migrate

# Cargar datos iniciales (opcional)
python manage.py loaddata seed.json

# Ejecutar el servidor
exec "$@"