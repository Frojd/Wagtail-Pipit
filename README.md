# Fröjd Django Boilerplate
This is a basic setup for Django.


## Requirements

- Python 2.7x
- Pip
- PostgreSQL
- Virtualenv


## Installation

1. Clone the project
2. Install a virtualenv in your new project folder (`virtualenv venv`)
3. Activate the virtualenv: `source venv/bin/activate` (or on windows: `./venv/Scripts/activate`)
4. Install the requirements from the environment you want (usually local version) with: `pip install -r requirements/local.txt`
5. Create a database in postgres and remember the database name and user/password
6. Copy the example.env and rename to .env and change the settings to your projects specific settings (including database etc)
7. Go into src `cd src`
8. Run the migrations to get auth system and the example pages app `python manage.py migrate`
9. Create a superuser for your admin: `python manage.py createsuperuser`
10. Start the development server: `python manage.py runserver`
11. Run `python manage.py collectstatic`
12. Visit your site on: [http://localhost:8000](http://localhost:8000)
13. Visit the adminview on: [http://localhost:8000/admin](http://localhost:8000/admin)


## Example app

To activate the example app, uncomment in it in base.py and it's included urls in urls.py in the core folder.


## Versioning

This boilerplate uses [semantic versioning](http://semver.org/) and follow django's MAJOR and MINOR version numbers, PATCH has no connection to django version, but is something we use to indicate updates.


## Coding style

We follow the [django coding style](https://docs.djangoproject.com/en/1.9/internals/contributing/writing-code/coding-style/), which is based on [PEP8](https://www.python.org/dev/peps/pep-0008).


### General Django guidelines

- **Views**
    - Use class based views
- **Urls**
    - Avoid using `patterns` in urls (since its deprecated)


## Contributing
Want to contribute? Awesome. Just send a pull request.


## License
Fröjd Django Boilerplate is released under the [MIT License](http://www.opensource.org/licenses/MIT).
