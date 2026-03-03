import os
import shutil


EXPERIMENTAL_USE_APP_ROUTER = "{{ cookiecutter.experimental_use_app_router }}" == "True"
PROJECT_SLUG = "{{ cookiecutter.project_slug }}"

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

# Patch uv.lock with the actual project slug (the lock file is copied
# without rendering so it ships with the default name "company-project")
lock_path = os.path.join(PROJECT_DIRECTORY, "src", "uv.lock")
if os.path.exists(lock_path):
    lock_text = open(lock_path).read()
    lock_text = lock_text.replace(
        'name = "company-project"',
        'name = "{}"'.format(PROJECT_SLUG.replace("_", "-")),
    )
    open(lock_path, "w").write(lock_text)
