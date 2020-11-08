import os
import stat
import shutil
import subprocess


PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)
DOCKER_DIR = os.path.join(PROJECT_DIRECTORY, 'docker', 'config')

shutil.copyfile(
    os.path.join(DOCKER_DIR, 'python.example.env'),
    os.path.join(DOCKER_DIR, 'python.env')
)
