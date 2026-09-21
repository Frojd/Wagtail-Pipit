"""
Write test settings here (for ci environment), or override base settings
"""
import logging
from typing import Any

from pipit.settings.base import *

DEBUG = False

logging.disable(logging.CRITICAL)

PASSWORD_HASHERS = ("django.contrib.auth.hashers.MD5PasswordHasher",)

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

MAILERS = {"default": {"BACKEND": "django.core.mail.backends.dummy.EmailBackend"}}

TEMPLATES[0]["OPTIONS"]["loaders"] = [  # type: ignore[index]
    (
        "django.template.loaders.cached.Loader",
        [
            "django.template.loaders.filesystem.Loader",
            "django.template.loaders.app_directories.Loader",
        ],
    )
]

LOGGING: dict[str, Any] = {}

TEST_RUNNER = "pipit.test_runner.PytestTestRunner"
