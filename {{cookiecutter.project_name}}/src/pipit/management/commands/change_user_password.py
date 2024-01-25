from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Change password for user
    (Not to be confused with changepass, this allows password as arg in cli)

    Example:
        manage.py change_user_password --user=admin --password=123
    """

    def add_arguments(self, parser):
        parser.add_argument("--user", required=True)
        parser.add_argument("--password", required=True)

    def handle(self, *args, **options):
        User = get_user_model()

        username = options["user"]
        password = options["password"]

        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()

        self.stdout.write("Password for {} changed".format(username))
