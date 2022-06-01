from django.urls import reverse
from wagtail.test.utils import WagtailPageTests
from wagtail.models import Site, BaseViewRestriction

from main.factories.base_page import BasePageFactory
from nextjs.factories import PageViewRestrictionFactory


class PasswordProtectedPageApiTest(WagtailPageTests):
    def setUp(self):
        self.site = Site.objects.first()

        self.root_page = BasePageFactory.create(title="Start", parent=None)
        self.site.root_page = self.root_page
        self.site.save()

    def test_redirect_page_if_user_is_not_logged_in(self):
        sub_page = BasePageFactory.create(title="Child page", parent=self.root_page)
        PageViewRestrictionFactory.create(
            page=sub_page,
            restriction_type=BaseViewRestriction.LOGIN,
        )

        url = reverse("nextjs:page_by_path:listing")
        response = self.client.get(
            f"{url}?html_path=/child-page",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("redirect" in data)

    def test_proper_page_if_user_is_logged_in(self):
        self.login()

        sub_page = BasePageFactory.create(title="Child page", parent=self.root_page)
        PageViewRestrictionFactory.create(
            page=sub_page,
            restriction_type=BaseViewRestriction.LOGIN,
        )

        url = reverse("nextjs:page_by_path:listing")
        response = self.client.get(
            f"{url}?html_path=/child-page",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["component_name"], "BasePage")
