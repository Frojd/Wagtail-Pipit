from django.core.management.base import BaseCommand
from wagtail.models import Site


class Command(BaseCommand):
    """
    Change site domain and port for wagtail.

    Example:
        manage.py wagtail_change_site_domain --site_id=2 --new_site_domain=frojd.se:443
    """

    def add_arguments(self, parser):
        parser.add_argument("--site_id", type=int, default=1)
        parser.add_argument("--new_site_domain", required=True)

    def handle(self, *args, **options):
        site_id = options["site_id"]
        new_site_domain = options["new_site_domain"]
        port = 80
        domain = new_site_domain

        if ":" in new_site_domain:
            domain, port = new_site_domain.split(":")

        site = Site.objects.get(pk=site_id)
        site.hostname = domain
        site.port = port
        site.save()

        self.stdout.write("Domain changed to {}".format(new_site_domain))
