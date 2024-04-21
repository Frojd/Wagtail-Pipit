import inspect
import os

import dotenv
from django.core.exceptions import ImproperlyConfigured


def get_env(name: str, default: str = "", required: bool = False) -> str:
    if name in os.environ:
        return os.environ[name]

    if required:
        raise ImproperlyConfigured(f"Set the {name} env variable")

    return default


def get_env_bool(name: str, default: bool) -> bool:
    if name in os.environ:
        value = os.environ[name]
        return value == "True"

    return default


def if_exists_load_env(name: str) -> None:
    current_frame = inspect.currentframe()
    if not current_frame:
        return

    inspect_file = inspect.getfile(current_frame)
    env_path = os.path.dirname(os.path.dirname(os.path.abspath(inspect_file)))
    env_file = "{env_path}/{name}".format(env_path=env_path, name=name)

    if os.path.exists(env_file):
        dotenv.load_dotenv(env_file, override=True)
