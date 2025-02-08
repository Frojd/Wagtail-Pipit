import factory
from factory.django import DjangoModelFactory
from wagtail_factories import SiteFactory

from .models import SiteSetting


class SiteSettingFactory(DjangoModelFactory):
    site = factory.SubFactory(SiteFactory)

    class Meta:
        model = SiteSetting
