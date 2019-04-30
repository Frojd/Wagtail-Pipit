[![CircleCI](https://circleci.com/gh/Frojd/Wagtail-Boilerplate.svg?style=svg)](https://circleci.com/gh/Frojd/Wagtail-Boilerplate)

# Pipit

Pipit is a [Wagtail CMS](https://wagtail.io/) boilerplate which aims to provide an easy and modern developer workflow with a React-rendered frontend.

The benefit of using Pipit is that we can cherry-pick the best JavaScript tools and have a 
modern frontend stack while still not making the trade-off normally would by running our application completely headless.

## Features

- Hot reloading
- Server-Side Rendering
- Page scaffolding
- [12-Factor App](https://12factor.net/) compliant
- Docker development environment
- Deploy scripts via [Ansistrano](https://github.com/ansistrano)
- Orchestration using [Ansible](https://github.com/ansible/ansible)
- Local SSL for development
- Error reporting with [Sentry](https://sentry.io/)
- CI integration via [Circle CI](https://circleci.com/)
- Data-sync between environments

## Installation

1. Make sure you have [cookiecutter](https://github.com/audreyr/cookiecutter/blob/master/docs/index.rst) installed. If not run `pip install cookiecutter` (or via brew)
2. Run cookiecutter:
```
cookiecutter https://github.com/Frojd/Wagtail-Boilerplate.git
```

3. Fill in the questions and you are done!

## Documentation – Where to go from here?
We recommend you to start by checking out the [Getting Started Guide](/docs/getting-started-guide.md). Otherwise, you can read up any of the following topics:
- [Frontend developer workflow](/docs/frontend-developer-guide.md)
- [Datasync between environments](/docs/data-sync.md)
- [Scaffolding](/docs/scaffolding.md)
- [Server-Side Rendering](/docs/server-side-rendering.md)
- [Deploying with Ansistrano](/docs/deployment.md)
- [Setting up continuous integration on CircleCI](/docs/ci.md)

## Why not headless?
The current state of Django in combination with JavaScript frontend technologies is 
to either go for a headless solution where Django is only used as an admin and data-provider
via API, or a hybrid approach where the most parts of the site are classic Django in Django Template Language and complex frontend
components are built in React (or another frontend framework).


The cost of going for the headless approach is that you lose basically everything
that Django provides for HTTP-requests. Including session management, CSRF, 
security middlewares, routing, previews, etc.

The problem we have encountered with the hybrid approach is that as your project grows,
it gets really hard to keep track of where your views are declared. 
Is it in the JavaScript or in Django Template Language? Also, the way React is designed makes it really 
hard to share state between different React-instances and you have to rely on technologies such as Redux.

## Contribute

If you have ideas for improvement, please share your thoughts through an issue. We also welcome PR's

- Issue Tracker: [https://github.com/Frojd/Wagtail-Boilerplate/issues](https://github.com/Frojd/Wagtail-Boilerplate/issues)
- Source Code: [https://github.com/Frojd/Wagtail-Boilerplate](https://github.com/Frojd/Wagtail-Boilerplate)

## Support

If you have any issues, please submit an issue and we will do our best to help you out.
