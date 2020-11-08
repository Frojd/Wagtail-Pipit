FROM python:3.8-alpine
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
    PYTHONPATH="${PYTHONPATH}:/app"

WORKDIR /app
ADD . /app/

ENV PACKAGES="\
    alpine-sdk \
    libffi-dev \
    musl-dev \
	postgresql-dev \
	postgresql-libs \
	linux-headers \
	zlib-dev \
	jpeg-dev \
"

RUN \
	apk add --virtual .build-deps --no-cache --upgrade $PACKAGES \
	&& echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
	&& echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
	&& echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories  \
	&& apk add \
		gcc \
        git \
		gdal-dev \
		geos-dev  \
		gettext \
		netcat-openbsd \
		bash \
    && pip install --upgrade pip \
    && pip install ipython --no-cache-dir \
    && pip install -r requirements/$REQUIREMENTS --no-cache-dir&& pip install pywatchman --no-cache-dir \
    && apk --purge del .build-deps

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["runserver"]
