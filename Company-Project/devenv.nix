# Nix dev environment for isolated Claude worktrees, see README.
# Ports are derived from worktree.slot, which scripts/worktree/up.sh writes to devenv.local.nix.
{
  pkgs,
  lib,
  config,
  ...
}:
let
  slot = config.worktree.slot;
  nginxPort = 8081 + 100 * slot;
  runserverPort = 8082 + 100 * slot;
  pgPort = 8083 + 100 * slot;
  nextPort = 3000 + 100 * slot;
  storybookPort = 3001 + 100 * slot;
  root = config.devenv.root;

  proxyHeaders = ''
    proxy_set_header Host $host:${toString nginxPort};
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  '';
in
{
  options.worktree.slot = lib.mkOption {
    type = lib.types.ints.between 1 9;
    default = 1;
  };

  config = {
    # Python comes from uv (.python-version), its standalone builds work the same on macOS and Linux
    packages = [ pkgs.uv ];

    languages.javascript = {
      enable = true;
      package = pkgs.nodejs_24;
    };

    services.postgres = {
      enable = true;
      package = pkgs.postgresql_16;
      listen_addresses = "127.0.0.1";
      port = pgPort;
      initialDatabases = [ { name = "app"; } ];
      initialScript = ''
        DO $$ BEGIN
          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
            CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD 'postgres';
          ELSE
            ALTER ROLE postgres WITH LOGIN PASSWORD 'postgres';
          END IF;
        END $$;
      '';
    };

    services.nginx = {
      enable = true;
      httpConfig = ''
        server {
          listen 127.0.0.1:${toString nginxPort};
          server_name _;
          proxy_read_timeout 120s;
          client_max_body_size 128M;

          location /wt/media {
            alias "${root}/src/media";
          }

          location / {
            ${proxyHeaders}
            proxy_pass http://127.0.0.1:${toString nextPort};
          }

          location /_next/webpack-hmr {
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_pass http://127.0.0.1:${toString nextPort}/_next/webpack-hmr;
          }

          location /_util {
            ${proxyHeaders}
            proxy_pass http://127.0.0.1:${toString runserverPort}/_util;
          }

          location /wt {
            ${proxyHeaders}
            proxy_pass http://127.0.0.1:${toString runserverPort}/wt;
          }
        }
      '';
    };

    processes.runserver = {
      exec = ''cd "$DEVENV_ROOT/src" && exec .venv/bin/python manage.py runserver "127.0.0.1:$RUNSERVER_PORT"'';
      after = [ "devenv:processes:postgres" ];
    };

    processes.nextdev.exec = ''cd "$DEVENV_ROOT/frontend" && exec npx next dev -H 127.0.0.1 -p "$NEXT_PORT"'';

    scripts.stack-up.exec = ''exec bash "$DEVENV_ROOT/scripts/worktree/up.sh" --services "$DEVENV_ROOT"'';
    scripts.stack-down.exec = ''cd "$DEVENV_ROOT" && devenv processes down'';
    scripts.storybook-dev.exec = ''cd "$DEVENV_ROOT/frontend" && exec npx storybook dev -p "$STORYBOOK_PORT" --no-open'';

    # Also in the shell env so pytest and other tools that skip manage.py get them.
    # DJANGO_SETTINGS_MODULE stays out of it, pytest-django would prefer it over pytest.ini.
    env = {
      SECRET_KEY = "worktree-local-secret-key";
      ALLOWED_HOSTS = "localhost,127.0.0.1,.localhost";
      DATABASE_NAME = "app";
      DATABASE_USER = "postgres";
      DATABASE_PASSWORD = "postgres";
      DATABASE_HOST = "127.0.0.1";
      DATABASE_PORT = toString pgPort;
      MEDIA_PATH = "${root}/src/media";
      STATIC_PATH = "${root}/src/static";
      NGINX_PORT = toString nginxPort;
      RUNSERVER_PORT = toString runserverPort;
      NEXT_PORT = toString nextPort;
      STORYBOOK_PORT = toString storybookPort;
      WORKTREE_SLOT = toString slot;
    };

    # manage.py loads src/.env with override, so the values are repeated in src/.env.local which it loads after.
    # Only in worktrees with a slot, so entering the shell in the main checkout never rewires its env files.
    enterShell = ''
      if [ -f "$DEVENV_ROOT/devenv.local.nix" ]; then
        cat > "$DEVENV_ROOT/src/.env.local" <<ENV
      DJANGO_SETTINGS_MODULE=pipit.settings.dev
      SECRET_KEY=$SECRET_KEY
      ALLOWED_HOSTS=$ALLOWED_HOSTS
      DATABASE_NAME=$DATABASE_NAME
      DATABASE_USER=$DATABASE_USER
      DATABASE_PASSWORD=$DATABASE_PASSWORD
      DATABASE_HOST=$DATABASE_HOST
      DATABASE_PORT=$DATABASE_PORT
      MEDIA_PATH=$MEDIA_PATH
      STATIC_PATH=$STATIC_PATH
      ENV
        cat > "$DEVENV_ROOT/frontend/.env.local" <<ENV
      WAGTAIL_API_URL=http://127.0.0.1:$NGINX_PORT/wt/api/nextjs
      ENV
      fi
      if [ -f "$DEVENV_ROOT/src/.venv/bin/activate" ]; then
        source "$DEVENV_ROOT/src/.venv/bin/activate"
      fi
    '';
  };
}
