import factory

from wagtail.core.models import Site, Page
from wagtail_factories import PageFactory

from .pages.base import BasePage



class BasePageFactory(PageFactory):
    class Meta:
        model = Base
