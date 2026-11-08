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
  nginxPort = {{ cookiecutter.docker_web_port }} + 100 * slot;
  runserverPort = {{ cookiecutter.docker_web_ssl_port }} + 100 * slot;
  pgPort = {{ cookiecutter.docker_db_port }} + 100 * slot;
  nextPort = {{ cookiecutter.nextjs_port }} + 100 * slot;
  storybookPort = {{ cookiecutter.storybook_port }} + 100 * slot;
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
    packages = [ pkgs.uv ];

    languages.python = {
      enable = true;
      package = pkgs.python314;
    };

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
      initialScript = "CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD 'postgres';";
    };

    services.nginx = {
      enable = true;
      httpConfig = ''
        server {
          listen 127.0.0.1:${toString nginxPort};
          listen [::1]:${toString nginxPort};
          server_name _;
          proxy_read_timeout 120s;
          client_max_body_size 128M;

          location /wt/media {
            alias ${root}/src/media;
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

    processes.nextdev.exec = ''cd "$DEVENV_ROOT/frontend" && exec npx next dev -p "$NEXT_PORT"'';

    processes.storybook = {
      exec = ''cd "$DEVENV_ROOT/frontend" && exec npx storybook dev -p "$STORYBOOK_PORT" --no-open'';
      start.enable = false;
    };

    env = {
      DATABASE_HOST = "127.0.0.1";
      DATABASE_PORT = toString pgPort;
      NGINX_PORT = toString nginxPort;
      RUNSERVER_PORT = toString runserverPort;
      NEXT_PORT = toString nextPort;
      STORYBOOK_PORT = toString storybookPort;
      WORKTREE_SLOT = toString slot;
    };

    # manage.py loads src/.env.local outside Docker and Next prefers frontend/.env.local over .env
    enterShell = ''
      cat > "$DEVENV_ROOT/src/.env.local" <<ENV
      DJANGO_SETTINGS_MODULE=pipit.settings.dev
      SECRET_KEY=worktree-local-secret-key
      ALLOWED_HOSTS=localhost,127.0.0.1,.localhost
      DATABASE_NAME=app
      DATABASE_USER=postgres
      DATABASE_PASSWORD=postgres
      DATABASE_HOST=$DATABASE_HOST
      DATABASE_PORT=$DATABASE_PORT
      MEDIA_PATH=$DEVENV_ROOT/src/media
      STATIC_PATH=$DEVENV_ROOT/src/static
      ENV
      cat > "$DEVENV_ROOT/frontend/.env.local" <<ENV
      WAGTAIL_API_URL=http://127.0.0.1:$NGINX_PORT/wt/api/nextjs
      ENV
      if [ -f "$DEVENV_ROOT/src/.venv/bin/activate" ]; then
        source "$DEVENV_ROOT/src/.venv/bin/activate"
      fi
    '';
  };
}
