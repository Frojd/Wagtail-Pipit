###########
# BUILDER #
###########

# using ubuntu LTS version
FROM ubuntu:24.04 AS builder-image

# avoid stuck build due to user prompt
ARG DEBIAN_FRONTEND=noninteractive
ARG ENVIRONMENT=prod

RUN apt-get update && apt-get install --no-install-recommends -y python3.12 python3.12-dev libpq-dev python3.12-venv build-essential && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.10.3@sha256:7a88d4c4e6f44200575000638453a5a381db0ae31ad5c3a51b14f8687c9d93a3 /uv /uvx /usr/local/bin/

# create and activate virtual environment
# using final folder name to avoid path issues with packages
RUN python3.12 -m venv /home/app/venv
ENV PATH="/home/app/venv/bin:$PATH"
ENV UV_PROJECT_ENVIRONMENT="/home/app/venv"

# install requirements
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --group $ENVIRONMENT --no-install-project

###########
# Final #
###########

FROM ubuntu:24.04 AS runner-image
ARG ENVIRONMENT=prod
RUN apt-get update && apt-get install --no-install-recommends -y netcat-openbsd vim gettext curl python3.12 python3-venv tzdata gdal-bin && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install uv (for runtime package management if needed)
COPY --from=ghcr.io/astral-sh/uv:0.10.3@sha256:7a88d4c4e6f44200575000638453a5a381db0ae31ad5c3a51b14f8687c9d93a3 /uv /uvx /usr/local/bin/

RUN groupadd -g 1001 app && useradd -u 1001 -g 1001 -m app
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

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/wt/health-check/ || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["gunicorn"]
