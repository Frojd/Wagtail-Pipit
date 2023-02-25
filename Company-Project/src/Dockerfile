FROM python:3.10-slim
MAINTAINER Frojd
LABEL version="v0.0.0"

ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=pipit.settings.local \
    ALLOWED_HOSTS=* \
    INTERNAL_IPS=0.0.0.0 \
    SECRET_KEY=generatesecretkeyhere \
    MEDIA_PATH=/app/media \
    STATIC_PATH=/app/static \
    REQUIREMENTS=local.txt \
    DATABASE_USER=postgres \
    DATABASE_PASSWORD=postgres \
    DATABASE_NAME=postgres \
    DATABASE_HOST=db \
    PYTHONPATH="${PYTHONPATH}:/app" \
    IN_DOCKER=1

WORKDIR /app
ADD . /app/

RUN apt-get update \
    && apt-get install -y netcat gcc libpq-dev \
    && apt-get install -y binutils libproj-dev gdal-bin \
    && apt-get install -y vim curl gettext \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip \
    && pip install -r requirements/$REQUIREMENTS --no-cache-dir \
    && pip install ipython ipdb

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["runserver"]
