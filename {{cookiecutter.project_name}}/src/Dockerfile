FROM python:3.6
MAINTAINER Frojd
LABEL version="v{{cookiecutter.version}}"

ENV PYTHONUNBUFFERED=1 \
    APP_LOG_DIR=/var/log/app/ \
    REQUIREMENTS=local.txt

WORKDIR /app
ADD . /app/

RUN apt-get update \
    && apt-get install -y netcat \
    {# Optional: GeoDjango deps -#}
    {% if cookiecutter.use_geodjango == 1 -%}
    && apt-get install -y binutils libproj-dev gdal-bin \
    {%- endif -%}
    && apt-get install -y vim curl \
    && rm -rf /var/lib/apt/lists/* \
    && curl -L https://raw.githubusercontent.com/Frojd/Frojd-Django-Boilerplate/develop/config/.vimrc > ~/.vimrc

RUN pip install -r requirements/$REQUIREMENTS --no-cache-dir \
    && pip install ipython

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["runserver"]
