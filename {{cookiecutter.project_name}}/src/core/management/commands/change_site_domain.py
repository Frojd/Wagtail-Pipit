import logging

from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    '''
    Change site domain and port for Site from django contrib

    Example:
        manage.py change_site_domain --site_domain=fro.dj --new_site_domain=frojd.se:443
    '''

    def add_arguments(self, parser):
        parser.add_argument('--site_id',
                            type=int,
                            default=-1)

        parser.add_argument('--site_domain',
                            default="")

        parser.add_argument('--new_site_domain',
                            required=True)

    def handle(self, *args, **options):
        site_id = options['site_id']
        site_domain = options['site_domain']
        new_site_domain = options['new_site_domain']

        port = 80
        domain = new_site_domain

        if ':' in new_site_domain:
            domain, port = new_site_domain.split(':')

        site_args = {}

        if site_id != -1:
            site_args['pk'] = site_id

        if site_domain:
            site_args['domain'] = site_domain

        site = Site.objects.get(**site_args)
        site.domain = domain
        site.save()

        self.stdout.write('Domain changed to {}'.format(new_site_domain))
