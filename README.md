# Fröjd Django Boilerplate
This is a basic setup for Django.

## Requirements
- Python 2.7x
- Pip
- PostgreSQL
- Virtualenv

## Installation
1. Clone the project
2. Copy everything except the .git folder to your new project
3. Install a virtualenv in your new project folder (virtualenv venv)
4. Activate the virtualenv: source venv/bin/activate (or on windows: ./venv/Scripts/activate)
4. Install the requirements from the environment you want (usually local version) with: pip install -r requirements/local.txt
5. Create a database in postgres and remember the database name and user/password
6. Copy the .env.example and rename to .env and change the settings to your projects specific settings (including database etc)
7. Go into src `cd src`
8. Start the developmentserver: `python manage.py runserver`
9. Visit your site on: http://localhost:8000
