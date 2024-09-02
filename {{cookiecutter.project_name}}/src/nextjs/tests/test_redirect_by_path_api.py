from django.urls import reverse
from wagtail.contrib.redirects.models import Redirect
from wagtail.models import Site
from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from main.factories.base_page import BasePageFactory


class RedirectByPathApiTest(WagtailPageTests):
    def setUp(self):
        self.site = Site.objects.first()

    def test_missing_args_returns_400(self):
        response = self.client.get(
            reverse("nextjs:redirect_by_path:detail"),
        )
        self.assertEqual(response.status_code, 400)

    def test_no_redirect_for_path_returns_404(self):
        response = self.client.get(
            reverse("nextjs:redirect_by_path:detail"), {"html_path": "/not-existing"}
        )
        self.assertEqual(response.status_code, 404)

    def test_redirect_is_detected(self):
        Redirect.add_redirect("/random/", "https://wagtail.io")
        response = self.client.get(
            reverse("nextjs:redirect_by_path:detail"), {"html_path": "/random/"}
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["destination"], "https://wagtail.io")

    def test_host_is_respected(self):
        page = BasePageFactory.create(title="Start", parent=None)
        site2 = SiteFactory.create(root_page=page, hostname="example2.test")

        Redirect.add_redirect("/random/", "https://wagtail.io", site=self.site)
        Redirect.add_redirect("/random/", "https://wagtail2.io", site=site2)

        response = self.client.get(
            reverse("nextjs:redirect_by_path:detail"),
            {"html_path": "/random/", "host": "example2.test"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["destination"], "https://wagtail2.io")
