import factory

from wagtail.core.models import Site, Page
from wagtail_factories import PageFactory

from .pages.base import Base



class BasePageFactory(PageFactory):
    class Meta:
        model = Base
