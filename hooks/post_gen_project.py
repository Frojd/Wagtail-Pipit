import os
import stat
import shutil
import subprocess


PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)
DOCKER_DIR = os.path.join(PROJECT_DIRECTORY, 'docker', 'config')

shutil.copyfile(
    os.path.join(DOCKER_DIR, 'web.example.env'),
    os.path.join(DOCKER_DIR, 'web.env')
)


# Clone react sass starterkit and use latest tag
shutil.rmtree(os.path.join(
    PROJECT_DIRECTORY, 'frontend'
))

starterkit_repo = 'git@github.com:Frojd/react-sass-starterkit.git'

# Clone starter kit into ./frontend
p = subprocess.Popen(['git', 'clone', starterkit_repo, 'frontend'])
p.communicate()

# Get the name of the latest tag
tag = subprocess.check_output(
    'cd frontend && git tag -l --sort=version:refname | tail -1',
    shell=True
)

# Fetch the tags and checkout latest tag
p = subprocess.Popen(
    'cd frontend && git fetch --tags && git checkout tags/{}'
    .format(tag.decode('utf-8')),
    shell=True
)
p.communicate()


def remove_readonly(func, path, excinfo):
    os.chmod(path, stat.S_IWRITE)
    func(path)

# Remove git repository from frontend
shutil.rmtree(os.path.join(
    PROJECT_DIRECTORY, 'frontend', '.git'
), onerror=remove_readonly)
