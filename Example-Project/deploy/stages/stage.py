"""
Stage environment
"""

from fabric.state import env
from fabric.decorators import task
from fabrik import paths
from fabrik.utils import get_stage_var
from fabrik.hooks import hook


@task
def stage():
    # Recipe
    from recipes import django_uwsgi
    django_uwsgi.register()

    # Metadata
    env.stage = "stage"

    # SSH Config
    env.hosts = [get_stage_var("HOST")]
    env.user = get_stage_var("USER")
    env.password = get_stage_var("PASSWORD", "")
    env.key_filename = get_stage_var("KEY_FILENAME")
    env.forward_agent = True

    env.app_path = get_stage_var("APP_PATH")
    env.source_path = get_stage_var("APP_SOURCE_PATH", "src")

    # Virtualenv
    env.requirements = "stage.txt"
    env.requirements_root = "src/requirements"
    env.venv_path = get_stage_var("VENV_PATH")

    # UWSGI
    env.uwsgi_ini_path = get_stage_var("UWSGI_INI_PATH")
