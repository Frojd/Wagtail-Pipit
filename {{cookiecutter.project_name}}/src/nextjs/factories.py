import factory
from factory.django import DjangoModelFactory
from wagtail.models import BaseViewRestriction, PageViewRestriction
from wagtail_factories import PageFactory


class PageViewRestrictionFactory(DjangoModelFactory):
    page = factory.SubFactory(PageFactory)
    restriction_type = BaseViewRestriction.PASSWORD

    class Meta:
        model = PageViewRestriction
