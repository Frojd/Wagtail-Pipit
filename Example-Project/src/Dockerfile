FROM python:2.7
MAINTAINER Frojd
LABEL version="v1.0.0"

RUN apt-get update && apt-get install -y netcat gettext

# Optional: GeoDjango deps
# RUN apt-get install -y binutils libproj-dev gdal-bin

ENV PYTHONUNBUFFERED 1
ENV APP_LOG_DIR /var/log/app/
ENV RUN_TYPE wsgi
ENV REQUIREMENTS local.txt

WORKDIR /app
ADD . /app/

RUN pip install -r requirements/$REQUIREMENTS && pip install ipython

# Install and setup vim
RUN apt-get update && apt-get install -y vim curl
RUN curl -L https://raw.githubusercontent.com/marteinn/Notebook/master/vim/vim-server-conf.vimrc > ~/.vimrc

EXPOSE 8000

COPY ./docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
