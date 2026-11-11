from typing import Any

from django.test import override_settings
from django.urls import reverse
from wagtail.models import Site
from wagtail.test.utils import WagtailPageTests

from main.factories.home_page import HomePageFactory


@override_settings(ALLOWED_HOSTS=["internal", "public.test"])
class WagtailUserbarApiTest(WagtailPageTests):
    def setUp(self) -> None:
        self.site = Site.objects.first()

        self.root_page = HomePageFactory.create(title="Start", parent=None)
        self.site.root_page = self.root_page
        self.site.save()

        self.page = HomePageFactory.create(title="Child page", parent=self.root_page)

    def get_page_userbar(self, **params: str) -> Any:
        response = self.client.get(
            reverse("nextjs:page_by_path:listing"),
            {"html_path": self.page.relative_url(self.site), **params},
            HTTP_HOST="internal:8000",
        )
        self.assertEqual(response.status_code, 200)
        return response.json()["component_props"]["wagtail_userbar"]

    def test_userbar_urls_use_forwarded_host(self) -> None:
        self.login()

        html = self.get_page_userbar(host="public.test:1234")["html"]

        self.assertIn("//public.test:1234/", html)
        self.assertIn(f"//public.test:1234/wt/cms/pages/{self.page.pk}/", html)
        self.assertNotIn("internal", html)

    def test_disallowed_host_falls_back_to_request_host(self) -> None:
        self.login()

        html = self.get_page_userbar(host="evil.test")["html"]

        self.assertIn("//internal:8000/", html)
        self.assertNotIn("evil.test", html)

    def test_missing_host_uses_request_host(self) -> None:
        self.login()

        html = self.get_page_userbar()["html"]

        self.assertIn("//internal:8000/", html)

    def test_no_userbar_for_anonymous(self) -> None:
        self.assertIsNone(self.get_page_userbar(host="public.test:1234"))

    def test_preview_panel_userbar_urls_use_forwarded_host(self) -> None:
        self.login()
        preview = self.page.create_page_preview()

        response = self.client.get(
            reverse("nextjs:page_preview:listing"),
            {
                "content_type": self.page.get_content_type_str(),
                "token": preview.token,
                "in_preview_panel": "true",
                "host": "public.test:1234",
            },
            HTTP_HOST="internal:8000",
        )

        self.assertEqual(response.status_code, 200)
        html = response.json()["component_props"]["wagtail_userbar"]["html"]
        self.assertIn("//public.test:1234/", html)
        self.assertIn("checker-axe-configuration", html)
        self.assertNotIn("internal", html)
