#!/bin/bash
CMD=$1

case "$CMD" in
    "start" )
        [ ! -d "./node_modules/" ] && npm install
        exec npm start
        ;;
    "start_ssl" )
        [ ! -d "./node_modules/" ] && npm install
        exec npm run start-ssl
        ;;
    "build" )
        exec npm run build
        ;;
    "test" )
        exec npm run test
        ;;
    "hypernova" )
        exec ./wait-for-it.sh -t 0 frontend:3000 -- npm run hypernova
        ;;
    "storybook" )
        exec ./wait-for-it.sh -t 0 frontend:3000 -- npm run storybook
        ;;
    * )
        # Run custom command. Thanks to this line we can still use
        # "docker run our_container /bin/bash" and it will work
        exec $CMD ${@:2}
        ;;
esac
