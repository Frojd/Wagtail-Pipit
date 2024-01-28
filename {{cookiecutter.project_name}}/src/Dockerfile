###########
# BUILDER #
###########

# using ubuntu LTS version
FROM ubuntu:22.04 AS builder-image

# avoid stuck build due to user prompt
ARG DEBIAN_FRONTEND=noninteractive
ARG ENVIRONMENT=prod

RUN apt-get update && apt-get install --no-install-recommends -y python3.11 python3.11-dev libpq-dev python3.11-venv python3-pip python3-wheel build-essential && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

# create and activate virtual environment
# using final folder name to avoid path issues with packages
RUN python3.11 -m venv /home/app/venv
ENV PATH="/home/app/venv/bin:$PATH"

# install requirements
COPY requirements/*.txt .
RUN pip3 install --no-cache-dir wheel
RUN pip3 install --no-cache-dir -r $ENVIRONMENT.txt

###########
# Final #
###########

FROM ubuntu:22.04 AS runner-image
ARG ENVIRONMENT=prod
RUN apt-get update && apt-get install --no-install-recommends -y netcat vim gettext curl python3.11 python3-venv tzdata gdal-bin && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN addgroup app --gid 1000 && adduser app --gid 1000 --uid 1000
COPY --from=builder-image /home/app/venv /home/app/venv

RUN mkdir /home/app/web /home/app/static
WORKDIR /home/app/web
COPY . .

EXPOSE 8000

# make sure all messages always reach console
ENV PYTHONUNBUFFERED=1

# activate virtual environment
ENV VIRTUAL_ENV=/home/app/venv
ENV PATH="/home/app/venv/bin:$PATH"

RUN chown -R app:app /home/app/web && chown -R app:app /home/app/static

# Required for collectstatic
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=pipit.settings.$ENVIRONMENT \
    ALLOWED_HOSTS=* \
    INTERNAL_IPS=0.0.0.0 \
    SECRET_KEY=generatesecretkeyhere \
    MEDIA_PATH=/home/app/media \
    STATIC_PATH=/home/app/static \
    SENTRY_DSN="" \
    REQUIREMENTS=$ENVIRONMENT.txt \
    DATABASE_USER=postgres \
    DATABASE_PASSWORD=postgres \
    DATABASE_NAME=app \
    DATABASE_HOST=db \
    PYTHONPATH="${PYTHONPATH}:/home/app/web" \
    IN_DOCKER=1
RUN python manage.py collectstatic --noinput

USER app
# /dev/shm is mapped to shared memory and should be used for gunicorn heartbeat
# this will improve performance and avoid random freezes

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["gunicorn"]
