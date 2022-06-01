from wagtail.test.utils import WagtailPageTests

from ..factories.base_page import BasePageFactory


class BasePageTest(WagtailPageTests):
    def test_factories_inheritance(self):
        page = BasePageFactory.create(title="Start", parent=None)
        self.assertIsNotNone(page.id)

        sub_page = BasePageFactory.create(title="Start", parent=page)
        self.assertEqual(sub_page.get_parent().id, page.id)
