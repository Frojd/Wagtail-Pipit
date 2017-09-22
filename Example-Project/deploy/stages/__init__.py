from fabric.state import env

from stage import stage  # NOQA
from prod import prod  # NOQA


env.scp_ignore_list = [
    'deploy',
    'docker',
    'frontend',
    'src/media',
    'src/static',
    'git-hooks',
]
