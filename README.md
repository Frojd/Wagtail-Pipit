# Fröjd Django Boilerplate
This is a basic setup for Django.

## Requirements
- Python 2.7x
- Pip
- PostgreSQL
- Virtualenv

## Installation
1. Clone the project
2. Copy everything except the .git folder and readme.md to your new project
3. Install a virtualenv in your new project folder (`virtualenv venv`)
4. Activate the virtualenv: source venv/bin/activate (or on windows: ./venv/Scripts/activate)
4. Install the requirements from the environment you want (usually local version) with: pip install -r requirements/local.txt
5. Create a database in postgres and remember the database name and user/password
6. Copy the .env.example and rename to .env and change the settings to your projects specific settings (including database etc)
7. Go into src `cd src`
8. Run the migrations to get auth system and the example pages app `python manage.py migrate`
9. Create a superuser for your admin: `python manage.py createsuperuser`
10. Start the developmentserver: `python manage.py runserver`
11. Visit your site on: http://localhost:8000
12. Visit the adminview on: http://localhost:8000/admin

## Example app

To activate the example app, uncomment in it in base.py and it's included urls in urls.py in the core folder.
