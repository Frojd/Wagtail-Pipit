from django.test import RequestFactory
from wagtail.test.utils import WagtailPageTests

from main.factories.home_page import HomePageFactory


class HeadlessPreviewPanelMixinTest(WagtailPageTests):
    def setUp(self) -> None:
        self.page = HomePageFactory.create(title="Start", parent=None)

    def test_preview_url_flags_the_preview_panel(self) -> None:
        request = RequestFactory().get("/")
        setattr(request, "in_preview_panel", True)  # noqa: B010

        url = self.page.get_preview_url(request, "token")

        self.assertIn("in_preview_panel=true", url)
        self.assertIn("token=token", url)

    def test_preview_url_without_preview_panel(self) -> None:
        request = RequestFactory().get("/")

        url = self.page.get_preview_url(request, "token")

        self.assertNotIn("in_preview_panel", url)
