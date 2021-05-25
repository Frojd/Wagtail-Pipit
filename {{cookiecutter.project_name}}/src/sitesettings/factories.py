import factory
from wagtail_factories import SiteFactory

from .models import SiteSetting


class SiteSettingFactory(factory.DjangoModelFactory):
    site = factory.SubFactory(SiteFactory)

    class Meta:
        model = SiteSetting
