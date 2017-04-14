import os
from shutil import copyfile

PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)
DOCKER_DIR = os.path.join(PROJECT_DIRECTORY, 'docker', 'config')

copyfile(
    os.path.join(DOCKER_DIR, 'db.example.env'),
    os.path.join(DOCKER_DIR, 'db.env')
)

copyfile(
    os.path.join(DOCKER_DIR, 'web.example.env'),
    os.path.join(DOCKER_DIR, 'web.env')
)
