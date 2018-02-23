from django.core.management import BaseCommand

from pages.models import Page


class Command(BaseCommand):
    '''
    Example command
    '''

    def handle(self, *args, **options):
        pages = Page.objects.all()

        if len(pages) == 0:
            self.stdout.write('No pages found')
            return

        for page in pages:
            self.stdout.write(u'%s - %s'.format(page.title, page.slug))
