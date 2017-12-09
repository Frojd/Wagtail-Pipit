import os
import shutil


PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)
DOCKER_DIR = os.path.join(PROJECT_DIRECTORY, 'docker', 'config')

shutil.copyfile(
    os.path.join(DOCKER_DIR, 'db.example.env'),
    os.path.join(DOCKER_DIR, 'db.env')
)

shutil.copyfile(
    os.path.join(DOCKER_DIR, 'web.example.env'),
    os.path.join(DOCKER_DIR, 'web.env')
)


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
