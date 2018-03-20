import factory

from wagtail.core.models import Site, Page

from .models.base import Base


class PageFactory(factory.DjangoModelFactory):
    class Meta:
        model = Page

    path = factory.Sequence(lambda x: '00010001{:04d}'.format(x + 1))
    depth = 3
    numchild = 0
    live = True

    title = factory.Sequence(lambda x: 'page-title-{0}'.format(x))


class SiteFactory(factory.DjangoModelFactory):
    class Meta:
        model = Site

    hostname = factory.Sequence(lambda x: 'host-{0}'.format(x))
    site_name = factory.Sequence(lambda x: 'Site {0}'.format(x))

    root_page = factory.SubFactory(PageFactory)


class BasePageFactory(PageFactory):
    class Meta:
        model = Base
