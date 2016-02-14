from django.core.management import BaseCommand

from pages.models import Page


class Command(BaseCommand):
    '''
    Example command
    '''

    def handle(self, *args, **options):
        pages = Page.objects.all()
        for page in pages:
            print u'%s - %s' % (page.title, page.slug)
