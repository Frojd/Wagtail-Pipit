"""
Write test settings here (for ci environment), or override base settings
"""
import logging
from typing import Dict, Any

from pipit.settings.base import *  # NOQA


DEBUG = False

logging.disable(logging.CRITICAL)

PASSWORD_HASHERS = ("django.contrib.auth.hashers.MD5PasswordHasher",)

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"

TEMPLATES[0]["OPTIONS"]["loaders"] = [  # type: ignore[index]
    (
        "django.template.loaders.cached.Loader",
        [
            "django.template.loaders.filesystem.Loader",
            "django.template.loaders.app_directories.Loader",
        ],
    )
]

LOGGING: Dict[str, Any] = {}

TEST_RUNNER = "pipit.test_runner.PytestTestRunner"
