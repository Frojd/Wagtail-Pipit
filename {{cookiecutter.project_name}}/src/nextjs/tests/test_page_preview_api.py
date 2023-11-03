from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from wagtail.models import Site
from wagtail.test.utils import WagtailPageTests

from main.factories.home_page import HomePageFactory


class PagePreviewApiTest(WagtailPageTests):
    def setUp(self):
        self.site = Site.objects.first()

        self.root_page = HomePageFactory.create(title="Start", parent=None)
        self.site.root_page = self.root_page
        self.site.save()

    def test_missing_args_returns_400(self):
        response = self.client.get(
            reverse("nextjs:page_preview:listing"),
        )
        self.assertEqual(response.status_code, 400)

    def test_preview_retrieval(self):
        sub_page = HomePageFactory.create(title="Child page", parent=self.root_page)
        preview = sub_page.create_page_preview()
        content_type = ContentType.objects.get_for_model(sub_page.__class__)

        token = preview.token
        content_type_str = f"{content_type.app_label}.{content_type.model}"

        response = self.client.get(
            reverse("nextjs:page_preview:listing"),
            {
                "content_type": content_type_str,
                "token": token,
            },
        )
        self.assertEqual(response.status_code, 200)
