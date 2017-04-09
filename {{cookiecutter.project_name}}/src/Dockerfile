FROM python:2.7
MAINTAINER Frojd
LABEL version="v{{cookiecutter.version}}"

ENV PYTHONUNBUFFERED=1 \
    APP_LOG_DIR=/var/log/app/ \
    RUN_TYPE=wsgi \
    REQUIREMENTS=local.txt

WORKDIR /app
ADD . /app/

RUN apt-get update \
    && apt-get install -y netcat \
    # Optional: GeoDjango deps
    # && apt-get install -y binutils libproj-dev gdal-bin \
    && apt-get install -y vim curl \
    && pip install -r requirements/$REQUIREMENTS --no-cache-dir \
    && pip install ipython \
    && curl -L https://raw.githubusercontent.com/marteinn/Notebook/master/vim/vim-server-conf.vimrc > ~/.vimrc \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["runserver"]
