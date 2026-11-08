# Ubuntu archive snapshot all stages install from, so rebuilds give the same packages.
# Bump to pick up OS security updates, to midnight UTC 3 days before today.
ARG APT_SNAPSHOT=20261105T000000Z

############
# APT BASE #
############

# using ubuntu LTS version
FROM ubuntu:26.04@sha256:da6fc2be547864451aa253836dd926da33623312df4a9a243e35dc877c378a78 AS apt-base
ARG APT_SNAPSHOT

# The base image has no CA bundle yet, package integrity comes from the archive signature.
# Snapshots only cover amd64, arm64 builds (Apple Silicon) use the live ports archive.
RUN if grep -q "ports.ubuntu.com" /etc/apt/sources.list.d/ubuntu.sources; then \
		echo "WARNING: ports archive has no snapshots, building against the live archive"; \
	else \
		sed -i "/^Signed-By:/a Snapshot: ${APT_SNAPSHOT}" /etc/apt/sources.list.d/ubuntu.sources && \
		grep -q "^Snapshot: ${APT_SNAPSHOT}" /etc/apt/sources.list.d/ubuntu.sources; \
	fi && \
	apt-get -o Acquire::https::snapshot.ubuntu.com::Verify-Peer=false -o APT::Update::Error-Mode=any -o Acquire::Retries=3 update && \
	apt-get -o Acquire::https::snapshot.ubuntu.com::Verify-Peer=false install --no-install-recommends -y ca-certificates && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

###########
# BUILDER #
###########

FROM apt-base AS builder-image

# avoid stuck build due to user prompt
ARG DEBIAN_FRONTEND=noninteractive
ARG ENVIRONMENT=prod

RUN apt-get -o APT::Update::Error-Mode=any -o Acquire::Retries=3 update && \
	apt-get install --no-install-recommends -y python3 python3-venv && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.13.5@sha256:32a7bb39b496babbd997b0a39a4d66c126bdaf5661b302bf6f06abda8deca6ff /uv /uvx /usr/local/bin/

# create and activate virtual environment
# using final folder name to avoid path issues with packages
RUN python3 -m venv --without-pip /home/app/venv
ENV PATH="/home/app/venv/bin:$PATH"
ENV UV_PROJECT_ENVIRONMENT="/home/app/venv"

# install requirements
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --group $ENVIRONMENT --no-install-project

###########
# Final #
###########

FROM apt-base AS runner-image
ARG ENVIRONMENT=prod
RUN apt-get -o APT::Update::Error-Mode=any -o Acquire::Retries=3 update && \
    apt-get install --no-install-recommends -y netcat-openbsd vim gettext curl python3 python3-venv tzdata gdal-bin && \
    apt-get upgrade -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install uv (for runtime package management if needed)
COPY --from=ghcr.io/astral-sh/uv:0.13.5@sha256:32a7bb39b496babbd997b0a39a4d66c126bdaf5661b302bf6f06abda8deca6ff /uv /uvx /usr/local/bin/

# Ubuntu 26.04 ships with a default ubuntu user (uid 1000); remove it to use our own.
# It also bundles Canonical's Pebble service manager, which we don't use and whose
# statically linked Go dependencies get flagged by the Trivy image scan
RUN userdel -r ubuntu && rm -f /usr/bin/pebble

RUN groupadd -g 1000 app && useradd -u 1000 -g 1000 -m app
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
