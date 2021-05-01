#!/bin/bash
set -e

# Generate development ssl certificates using mkcert
# NOTE: you need mkcert installed locally for this to work!

readonly DOMAIN="example.com.test"
readonly HTTPS_PORT=8082

if ! [ -d .git ]; then
    echo "Please initialize a git repo in this project before running this command"
    exit -1;
fi

cd $(git rev-parse --show-toplevel)

which mkcert
if [ $? -eq 0 ]; then
    printf "\n* Found mkcert in path!\n\n"
else
    echo "* Can't find mkcert binary in PATH, please install, then run this script again: https://github.com/FiloSottile/mkcert"
    exit -1
fi

read -p "Warning: the rootCA-key.pem file that mkcert automatically installs locally
gives complete power to intercept secure requests from your machine. Do not share it.

Continue (y/n)?" CONT

if ! [ "$CONT" = "y" ]; then
    exit -1;
fi

mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem $DOMAIN

sed -i.bak 's/\#mkcert\ //g' docker/files/config/nginx.conf.template
rm -f docker/files/config/nginx.conf.template.bak

docker-compose stop
docker-compose rm -f web
docker-compose up -d

echo "---"
echo "Done!"
echo "The application is now available with SSL at: https://$DOMAIN:$HTTPS_PORT"

cd -
