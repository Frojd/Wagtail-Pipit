from django.test.client import RequestFactory
from wagtail.tests.utils import WagtailPageTests

from ..factories import BasePageFactory


class BasePageTest(WagtailPageTests):
    def test_base_page(self):
        page = BasePageFactory.create(
            title='Start',
            parent=None,
        )

        self.assertIsNotNone(page.id)

        sub_page = BasePageFactory.create(
            title='Start',
            parent=page,
        )

        self.assertEqual(sub_page.get_parent().id, page.id)

