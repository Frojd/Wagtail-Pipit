import json

from django.conf import settings
from django.test import Client
from django.urls import reverse
from wagtail.models import Site
from wagtail.test.utils import WagtailPageTests

from main.factories.base_page import BasePageFactory
from nextjs.factories import PageViewRestrictionFactory


class CsrfTokenApiTest(WagtailPageTests):
    def setUp(self) -> None:
        self.client = Client(enforce_csrf_checks=True)

        site = Site.objects.first()
        root_page = BasePageFactory.create(title="Start", parent=None)
        site.root_page = root_page
        site.save()

        self.sub_page = BasePageFactory.create(title="Child page", parent=root_page)
        self.restriction = PageViewRestrictionFactory.create(
            page=self.sub_page,
            password="hello",
        )
        self.password_url = reverse(
            "nextjs:password_protected_page:detail_view",
            args=(self.restriction.pk, self.sub_page.pk),
        )

    def test_returns_token_and_sets_cookie(self) -> None:
        response = self.client.get(reverse("nextjs:csrf_token:listing"))

        self.assertEqual(response.status_code, 200)
        self.assertIn(settings.CSRF_COOKIE_NAME, response.cookies)
        self.assertTrue(response.json()["csrf_token"])

    def test_token_passes_csrf_on_password_post(self) -> None:
        token = self.client.get(reverse("nextjs:csrf_token:listing")).json()[
            "csrf_token"
        ]

        response = self.client.post(
            self.password_url,
            json.dumps({"password": "hello"}),
            content_type="application/json",
            headers={"X-CSRFToken": token},
        )
        self.assertEqual(response.status_code, 204)

    def test_password_post_without_token_is_forbidden(self) -> None:
        self.client.get(reverse("nextjs:csrf_token:listing"))

        response = self.client.post(
            self.password_url,
            json.dumps({"password": "hello"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)
