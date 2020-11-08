# Backend Developer Guide

In this tutorial we'll explain how you create a Wagtail page model, how to include a custom field and then finally how to build out the react frontend.

It consists of three parts:

- [Getting started](#getting-started)
- [Creating a page in Wagtail](#creating-a-page-in-wagtail)
- [Creating a page in the frontend](#creating-a-page-in-the-frontend)

This document also provides info on the following topics:
- [Command reference](#command-reference) 
- [General recommendations](#general-recommendations)


## Getting started

The project backend, based on Wagtail and the CMS Wagtail is located in `/src`, here's an overview of its content:

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
├── nextjs                      # Enables communication between Next.js and Wagtail
├── pipit                       # This is a bootstrap app that contains settings, translations and routing
│   ├── context_processors.py   # Provides templates with values
│   ├── locale                  # Translation files
│   ├── management              # Contains Pipit specific management commands
│   ├── settings                # Contains all app settings
│   │   ├── base.py             # Put all your mandatory configuration here
│   │   ├── local.py            # Put your local configuration here
│   │   ├── prod.py             # Put your production configuration here
│   │   ├── stage.py            # Put your stage configuration here
│   │   └── test.py             # Put your test configuration here
│   ├── templates               # Contains Pipit specific templates (like the page scaffolder)
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

## Configuring docker

Make sure you follow the install instructions in the project README.md, in short, it boils down to this:

1. Set up env vars: `cp docker/config/python.example.env docker/config/python.env`
2. Include the domain in your hosts file. `127.0.0.1 blog.acme.com.test`


## Running docker

To run docker, run `docker-compose up` from the project root (the folder contains a `docker-compose.yml` file).

This will create the following docker containers:

```
├── web         # Contains the web server we make requests to, it will either direct requests to the python container or our locally running Next.js application
├── python      # Contains python and runs the django runserver development server
├── db          # Contains PostgreSQL with the PostGIS extension
```

When all the containers are running, open your browser and navigate to either:
- `http://blog.acme.com.test:8081/wt/cms` to access the Wagtail admin
- `http://blog.acme.com.test:8081/wt/admin` to access the Django admin.

`/wt` is short for `/WagTail` and is where the Django/Wagtail app is hosted. Requests to anything else (such as `/` or `/my-very-excellent-path`) are passed to our Next.js app. The proxy server in the `web` container does this for us.


## Creating a page in Wagtail

Start by generating a new page in Wagtail, we have a management command to simplify the process called `new_page`.

```
docker-compose exec python ./manage.py new_page --name=About
```

This will create the following files:

```
main
├── factories
│   ├── about_page.py
├── pages
│   ├── about.py
│   ├── about_serializer.py
├── tests
│   ├── test_about_page.py
```

### Files explained

#### factories/about_page.py
Contains [factory-boy](https://factoryboy.readthedocs.io/en/stable/) factories for the page model, we use it to simplify data creation when testing.

#### pages/about.py
The code that creates the about page Wagtail model.

#### pages/about_serializer.py
Holds logic for transforming the page model into json data, used by our Next.js frontend.

#### tests/test_about_page.py
Tests to make sure the data transformation is done correctly. It's also a good place to put future business logic tests related to the page model.

### Adding a new field

Modify `main/pages/about.py` and include `company_name` both as a model field and as a content panel, it should look like this:

```python
from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.edit_handlers import FieldPanel

from .base import BasePage


class AboutPage(BasePage):
    company_name = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_("Company name"),
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("company_name"),
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.AboutPageSerializer"

    class Meta:
        verbose_name = _("About")
```

After adding our field we need to create a new database migration.

```
docker-compose exec python ./manage.py makemigrations
```

We also need to run the migration so database changes are applied.

```
docker-compose exec python ./manage.py migrate
```

Now login to the Wagtail cms at `http://blog.acme.com.test:8081/wt/cms` using:

```
Username: admin
Password: admin
```

Then choose to create a new page of type "About" by going to your Home Page at `http://blog.acme.com.test:8081/wt/cms/pages/3/` and pressing "Add subpage".

You should see a `company_field` in the admin.
Name the page "My about page" and in the field "Company Name" write "Acme Inc", then hit publish.

### Writing tests

Modify `main/tests/test_about_page.py` and include this test case.

```python
def test_that_company_name_are_retuned(self):
    page = AboutPageFactory.create(title="About", company_name="Acme", parent=self.root_page)

    data = page.get_component_data({})
    self.assertEqual(data["component_props"]["company_name"], "Acme")
```

Now run it.

```
docker-compose exec python pytest
```

Oh no - It fails. But that's all right, that means we need to add `company_name` to our serializer.


### Add field to serializer

Modify `main/pages/about_serializer.py`

```python
from .base_serializer import BasePageSerializer
from . import AboutPage


class AboutPageSerializer(BasePageSerializer):
    class Meta:
        model = AboutPage
        fields = [
            "company_name",
        ] + BasePageSerializer.Meta.fields
```

Now run the tests again.

```
docker-compose exec python pytest
```

Tests pass.

### Inspecting the field from the api

This is pretty much it on the backend, the serializer is invoked any time a request is made to our page and will transform it to json.

If you are curious on how the data that will be served to the frontend will look like, do the following:

```
curl 'http://blog.acme.com.test:8081/wt/api/nextjs/v1/page_by_path/?html_path=/my-about-page'
{
    "component_name": "AboutPage",
    "component_props": {
        "company_name": "Acme Inc",
        "title": "My about page",
        ...
    }
}
```

A couple of things are going on here, the api will retrive the page by path and return enough information for our frontend to know which container to use and what data it should contain.


## Creating a page in the frontend

We are now done with the backend and are halfway there, now it's time to add frontend.
The frontend steps are described in more detail [frontend-developer-guide.md](./frontend-developer-guide.md), so we won't go into too much explanation here, but rather what commands and what code to write.

First make sure you have your frontend installed:

```
cd frontend
npm i
```

Then create a container component representing our About page by using our cli:

```bash
npm run new:container AboutPage
```

Now modify the newly created container `containers/AboutPage/AboutPage.js" and include our new field in the container component.

```javascript
import React, { PureComponent } from 'react';

// import i18n from '../../i18n';
import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import s from './AboutPage.module.css';

class AboutPage extends PureComponent {
    state = {};

    static defaultProps = {
        companyName: '',
    };

    static propTypes = {
        companyName: PropTypes.string,
    };

    render() {
        const { companyName } = this.props;
        return (
            <div className={s['AboutPage']}>
                <p>Company name: {companyName}</p>
            </div>
        );
    }
}

export default basePageWrap(AboutPage);
```

Then, to expose your container to Next.js you also need to put your container in our container register: `containers/LazyContainers.js`

```bash
import dynamic from 'next/dynamic';

export default {
    // Other containers
    ...
    AboutPage: dynamic(() => import('./AboutPage')),
};
```

The last step is to start your Next.js app (`npm run dev`) and open `http://blog.acme.com.test:8081/my-about-page`

You should now have a working page here that displays Acme Inc as a company name.

## Command reference

#### new_page

```
$ ./manage.py new_page --name=name
```

This command scaffolds a Wagtail page and generates a model, serializer, test factory and a set of tests.

Options:
- name: This is the name for your page. Do not include "Page" in the name as it will be included as a suffix. Example "About" will generate the model "AboutPage".


## General recommendations

#### Put your page models in `main/pages`
Although a Wagtail page is also a model, we have taken the decision to separate models and page models, because of this they live in their own directory.

