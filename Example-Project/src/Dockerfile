FROM python:3.6
MAINTAINER Frojd
LABEL version="v0.1.0"

ENV PYTHONUNBUFFERED=1 \
    APP_LOG_DIR=/var/log/app/ \
    REQUIREMENTS=local.txt

WORKDIR /app
ADD . /app/

RUN apt-get update \
    && apt-get install -y netcat \
    && apt-get install -y vim curl gettext \
    && rm -rf /var/lib/apt/lists/* \
    && curl -L https://raw.githubusercontent.com/Frojd/Frojd-Django-Boilerplate/develop/config/.vimrc > ~/.vimrc

RUN apt-get update && apt-get -y install postgresql

RUN pip install -r requirements/$REQUIREMENTS --no-cache-dir \
    && pip install ipython

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["runserver"]
