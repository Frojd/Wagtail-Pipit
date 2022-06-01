from django.core.management.base import BaseCommand
from wagtail.models import Site, Page

from main.models import HomePage


class Command(BaseCommand):
    """
    Switch site root page to HomePage

    Example:
        manage.py wagtail_replace_default_site_root_page
    """

    def handle(self, *args, **options):
        if Site.objects.count() > 1:
            return

        if Page.objects.count() > 2:
            return

        site = Site.objects.first()

        if site.root_page.specific.__class__.__name__ != Page.__name__:
            return

        root_page = Page.objects.filter(depth=1).first()

        new_site_page = HomePage(title="Home Page", slug="home-page")
        root_page.add_child(instance=new_site_page)

        old_site_page = site.root_page
        site.root_page = new_site_page
        site.save()

        old_site_page.delete()

        self.stdout.write("Default site root page was changed")
