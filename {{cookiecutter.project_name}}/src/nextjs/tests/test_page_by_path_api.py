from django.urls import reverse
from wagtail.models import Site
from wagtail.test.utils import WagtailPageTests

from main.factories.base_page import BasePageFactory


class PageByPathApiTest(WagtailPageTests):
    def setUp(self):
        self.site = Site.objects.first()

        self.root_page = BasePageFactory.create(title="Start", parent=None)
        self.site.root_page = self.root_page
        self.site.save()

    def test_root_page_retreaval(self):
        BasePageFactory.create(title="Child page", parent=self.root_page)

        url = reverse("nextjs:page_by_path:listing")

        response = self.client.get(f"{url}?html_path=")
        self.assertEqual(response.status_code, 200)

    def test_child_page_retreaval(self):
        sub_page = BasePageFactory.create(title="Child page", parent=self.root_page)

        url = reverse("nextjs:page_by_path:listing")
        response = self.client.get(
            f"{url}?html_path={sub_page.relative_url(self.site)}"
        )
        self.assertEqual(response.status_code, 200)

    def test_missing_html_path_triggers_400_error(self):
        url = reverse("nextjs:page_by_path:listing")

        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
