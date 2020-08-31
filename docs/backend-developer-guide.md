# Backend Developer Guide

- [Getting started](#getting-started)
- [Creating a page](#creating-a-page)


## Getting started

The project backend is located in `/src`, here's an overview of its content:

```bash
├── customdocument              # Extends Wagtails Document model
├── customimage                 # Extends Wagtails Image model
├── customuser                  # Extends the Django User model
├── main                        # The primary app where we store models and pages
│   ├── blocks                  # Put your custom block/stream field blocks here
│   ├── factories               # Put your test factories
│   ├── middlewares             # Application middlewares
│   ├── migrations              # Database migrations
│   ├── mixins.py               # Put your model and view mixins here
│   ├── models.py               # Put your Django models here
│   ├── pages                   # Put your Wagtail pages here
│   ├── serializers.py          # Put your non-Wagtail page serializers here
│   ├── templates               # Put all your templates here
│   ├── tests                   # Put your tests here
│   └── views                   # Put your Django and DRF views here
├── manage.py                   # Django admin tool with addons for loading .env files
├── pipit                       # This is a bootstrap app that contains settings, translations and routing
│   ├── context_processors.py   # Application
│   ├── locale                  # Translation files
│   ├── management              # Contains Pipit specific management commands
│   ├── settings                # Contains all app settings
│   │   ├── base.py             # Put all your mandatory configuration here
│   │   ├── local.py            # Put your local configuration here
│   │   ├── prod.py             # Put your production configuration here
│   │   ├── stage.py            # Put your stage configuration here
│   │   └── test.py             # Put your test configuration here
│   ├── templates               # Contains Pipit specific templates (like the page scaffolder)
│   ├── templatetags            # Contains Pipit specific templatetags (like the Create React App helpers)
│   ├── test_runner.py          # Lets us use pytest as default test runner
│   ├── urls.py                 # The entrypoint for all routing
│   ├── wagtail_hooks.py        # Contains pipit specific Wagtail overrides
│   └── wsgi.py                 # Default Django wsgi configuration
├── pytest.circleci.ini         # Custom Pytest configuration for Circle CI
├── pytest.ini                  # Pytest configuration
├── requirements                # Contains pip requirements
│   ├── base.txt                # Put any mandatory requirements here (example wagtail)
│   ├── local.txt               # Put local environment requirements here (example django-debug-toolbar)
│   ├── prod.txt                # Put production only requirements here (example boto)
│   ├── stage.txt               # Put stage only requirements here (example boto)
│   └── test.txt                # Put requirements only used in test here (example factory-boy)
├── sitesettings                # Contains site customizations
├── utils                       # Contains global python utility functions
```


## Creating a page
