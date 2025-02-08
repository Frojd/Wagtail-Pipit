# Adding sentry to Pipit

It's important to capture and track errors once your app is deployed, that is why Pipit ships with built in Sentry support, this guide explains how you activate it.

## Requirements

Before you get started, make sure you have the following:

- [A Sentry account](https://sentry.io/signup/)
- A Sentry project for your application


## Guide

### Obtaining Sentry information

- In Sentry, open your project settings
- Click on SDK Setup / Client Keys (DSN)
- Copy your DSN key, we'll use it through this guide
- Open your project general settings and copy your project name (will later be used as `SENTRY_PROJECT`)
- Open your organization settings, click on general settings and copy organization slug (will later be used as `SENTRY_ORG`)
- Create a auth token by going to your organization settings / developer settings and create a new internal integration for Circle CI
    - Name: CircleCI
    - Overview: "Makes it possible to upload project sourcemaps"
    - Project: No Access
    - Team: No Access
    - Release: Admin <-- This is very important
    - Organization: Read & Write
    - Member: No Access
    - Save and copy your auth token (will later be used as `SENTRY_AUTH_TOKEN`)


### Setup and test locally

#### Django
- Update `docker/config/python.env`
- Change so Django runs in production mode
    ```
    DJANGO_SETTINGS_MODULE=pipit.settings.prod
    ```
- Add your Sentry DSN: 
    ```
    SENTRY_DSN=https://public@sentry.example.com/1
    ```
- We are done editing `python.env`, save the file
- Restart your project
    ```
    docker compose stop && docker compose up
    ```
- Open the python repl in docker
    ```
    docker compose exec python -c "./manage.py shell"
    ```
- Trigger a divison by zero error
    ```
    >>> 1 / 0
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
    ZeroDivisionError: division by zero
    ```
- This will trigger and error and send it to sentry

#### Next.js
- Update `frontend/.env`
- Add your Sentry DSN: 
    ```
    NEXT_PUBLIC_SENTRY_DSN=https://public@sentry.example.com/1
    ```
- Update `frontend/pages/[...path].js` and make it throw an error
    ```
    export default function CatchAllPage({ componentName, componentProps }) {
        throw Error("This is a Next.js error");
        
        const Component = LazyContainers[componentName];
        if (!Component) {
            return <h1>Component {componentName} not found</h1>;
        }
        return <Component {...componentProps} />;
    }
    ```
- Compile next 
    ```
    npm run build
    ```
- Run production server
    ```
    NODE_ENV=production npm run start npm run start
    ```
- Open the website in your browser
- This will trigger the error and send it to Sentry

### In production

#### Django
- Make sure your Django project runs using the stage (`pipit.settings.stage`) or prod (`pipit.settings.prod`) settings
- Update your `.env` file and add the Sentry DSN
  ```
  SENTRY_DSN=https://public@sentry.example.com/1
  ```
- We are done editing `.env`, save the file
- Restart your application
    ```
    service uwsgi restart
    ```
- Open the python repl
    ```
    python manage.py shell
    ```
- Trigger a divison by zero error
    ```
    >>> 1 / 0
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
    ZeroDivisionError: division by zero
    ```
- This will trigger and error and send it to sentry

#### Next.js
- When it comes to Next.js we need to define the DSN before `npm run build` runs, which is normally in our CI pipeline. Here we assume you use Circle CI as it's the default CI service for Pipit.
- Login to Circle CI
- Open your environment variable management in Circle CI by going to My repository / Project Settings / Environment Variables
- Add the following Sentry details that you obtained in the beginning of this guide
    - `NEXT_PUBLIC_SENTRY_DSN=https://public@sentry.example.com/1`
    - `SENTRY_AUTH_TOKEN=random123`
    - `SENTRY_ORG=MyOrg`
    - `SENTRY_PROJECT=MyOrg-MyProject`
- Once this is done, trigger a CI build
- The CI build will
    - Bundle the Sentry DSN with your app
    - Upload sourcemaps
- Once the build is complete, verify that your source maps are uploaded by
    - Open Sentry
    - Go to your project settings
    - Open Processing / Sourcemaps
    - Here you should see a new source map for your project
- Done!
