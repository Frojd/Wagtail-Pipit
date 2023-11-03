from io import StringIO

from django.core.management import call_command
from django.test import TestCase


class NoPendingMigrationsTest(TestCase):
    def test_migrations(self):
        output = StringIO()
        call_command("makemigrations", interactive=False, dry_run=True, stdout=output)
        self.assertIn("No changes detected", output.getvalue())
