from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from wagtail.tests.utils import WagtailPageTests
from wagtail.core.models import Site
from wagtail.contrib.redirects.models import Redirect
import wagtail_factories


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
        redirect = Redirect.add_redirect("/random/", "https://wagtail.io")
        response = self.client.get(
            reverse("nextjs:redirect_by_path:detail"), {"html_path": "/random/"}
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["destination"], "https://wagtail.io")
