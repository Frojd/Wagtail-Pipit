import os
import shutil
import subprocess


PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)
DOCKER_DIR = os.path.join(PROJECT_DIRECTORY, 'docker', 'config')

shutil.copyfile(
    os.path.join(DOCKER_DIR, 'web.example.env'),
    os.path.join(DOCKER_DIR, 'web.env')
)


# Clone react sass starterkit and use latest tag
if '{{ cookiecutter.use_react_sass_starterkit }}'.lower() == 'y':
    shutil.rmtree(os.path.join(
        PROJECT_DIRECTORY, 'frontend'
    ))

    starterkit_repo = 'git@github.com:Frojd/react-sass-starterkit.git'

    # Clone starter kit into ./frontend
    p = subprocess.Popen(['git', 'clone', starterkit_repo, 'frontend'])
    p.communicate()

    # Get the name of the latest tag
    tag = subprocess.check_output('cd frontend && git describe --tags $(git rev-list --tags --max-count=1)', shell=True)

    # Fetch the tags and checkout latest tag
    p = subprocess.Popen('cd frontend && git fetch --tags && git checkout tags/{}'.format(tag.decode('utf-8')), shell=True)
    p.communicate()

    # Remove git repository from frontend
    shutil.rmtree(os.path.join(
        PROJECT_DIRECTORY, 'frontend/.git'
    ))


# Remove sites framework file (if wagtail is in use)
if '{{ cookiecutter.use_wagtail }}'.lower() == 'y':
    os.remove(os.path.join(
        PROJECT_DIRECTORY, 'src/core/management/commands/change_site_domain.py'  # NOQA
    ))


# Remove wagtail specific files if not in use
if '{{ cookiecutter.use_wagtail }}'.lower() == 'n':
    os.remove(os.path.join(
        PROJECT_DIRECTORY, 'src/core/management/commands/wagtail_change_site_domain.py'  # NOQA
    ))

    shutil.rmtree(os.path.join(
        PROJECT_DIRECTORY, 'src/sitesettings'
    ))

    shutil.rmtree(os.path.join(
        PROJECT_DIRECTORY, 'src/customimage'
    ))
