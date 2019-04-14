{% raw %}from wagtail.tests.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories import BasePageFactory, {{ name }}PageFactory
from ..pages.{{ name|lower }}_serializer import {{ name }}PageSerializer


class {{ name }}PageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = {{ name }}PageFactory.create(title="{{ name }}", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), {{ name }}PageSerializer)

    def test_to_react_representation(self):
        page = {{ name }}PageFactory.create(title="{{ name }}", parent=self.root_page)

        data = page.to_react_representation()

        self.assertTrue("title" in data)
        self.assertEqual("{{ name }}", data["title"]){% endraw %}
