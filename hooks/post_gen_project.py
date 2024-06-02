import os
import shutil


EXPERIMENTAL_USE_APP_ROUTER = "{{ cookiecutter.experimental_use_app_router }}" == "True"

PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)
DOCKER_DIR = os.path.join(PROJECT_DIRECTORY, "docker", "config")

shutil.copyfile(
    os.path.join(DOCKER_DIR, "python.example.env"),
    os.path.join(DOCKER_DIR, "python.env"),
)

if EXPERIMENTAL_USE_APP_ROUTER:
    shutil.rmtree(os.path.join(PROJECT_DIRECTORY, "frontend", "pages"))
else:
    shutil.rmtree(os.path.join(PROJECT_DIRECTORY, "frontend", "app"))
