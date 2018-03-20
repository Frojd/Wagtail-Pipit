from django.test.client import RequestFactory
from wagtail.tests.utils import WagtailPageTests

from ..factories import BasePageFactory


class BasePageTests(WagtailPageTests):
    def test_creatable(self):
        page = BasePageFactory.create(
            title='Start',
        )

        assert page.id is not None
