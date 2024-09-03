from django.urls import reverse
from wagtail.models import Site
from wagtail.test.utils import WagtailPageTests

from main.factories.base_page import BasePageFactory


class ExternalViewApiTest(WagtailPageTests):
    def setUp(self):
        self.site = Site.objects.first()

        self.root_page = BasePageFactory.create(title="Start", parent=None)
        self.site.root_page = self.root_page
        self.site.save()

    def test_retrieval(self):
        BasePageFactory.create(title="Child page", parent=self.root_page)

        url = reverse("nextjs:external_view_data:detail", kwargs={"pk":"404"})

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response_data = response.json()
        self.assertEqual(response_data["component_name"], "NotFoundPage")
