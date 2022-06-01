import json

from django.urls import reverse
from wagtail.test.utils import WagtailPageTests
from wagtail.models import Site

from main.factories.base_page import BasePageFactory
from nextjs.factories import PageViewRestrictionFactory


class PasswordProtectedPageApiTest(WagtailPageTests):
    def setUp(self):
        self.site = Site.objects.first()

        self.root_page = BasePageFactory.create(title="Start", parent=None)
        self.site.root_page = self.root_page
        self.site.save()

    def test_missing_password_yeilds_401(self):
        sub_page = BasePageFactory.create(title="Child page", parent=self.root_page)
        page_view_restriction = PageViewRestrictionFactory.create(page=sub_page)

        url = reverse(
            "nextjs:password_protected_page:detail_view",
            args=(page_view_restriction.pk, sub_page.pk),
        )

        response = self.client.post(url)
        self.assertEqual(response.status_code, 401)

    def test_incorrect_password_returns_401(self):
        sub_page = BasePageFactory.create(title="Child page", parent=self.root_page)
        page_view_restriction = PageViewRestrictionFactory.create(
            page=sub_page,
            password="hello",
        )

        url = reverse(
            "nextjs:password_protected_page:detail_view",
            args=(page_view_restriction.pk, sub_page.pk),
        )

        response = self.client.post(
            url,
            json.dumps({"password": "wrong-password"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_correct_password_returns_ok(self):
        sub_page = BasePageFactory.create(title="Child page", parent=self.root_page)
        page_view_restriction = PageViewRestrictionFactory.create(
            page=sub_page,
            password="hello",
        )

        url = reverse(
            "nextjs:password_protected_page:detail_view",
            args=(page_view_restriction.pk, sub_page.pk),
        )

        response = self.client.post(
            url,
            json.dumps({"password": "hello"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
