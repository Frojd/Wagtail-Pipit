from django.core.management import BaseCommand
from pages.models import Page


class Command(BaseCommand):
    def handle(self, *args, **options):
        pages = Page.objects.all()
        print ['%s - %s' % (page.title.encode('utf8'), page.slug.encode('utf8'))
               for page in pages]
