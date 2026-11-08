import json

from django.urls import reverse
from wagtail.models import Site
from wagtail.test.utils import WagtailPageTests

from main.factories.base_page import BasePageFactory
from nextjs.factories import PageViewRestrictionFactory


class PasswordProtectedPageApiTest(WagtailPageTests):
    def setUp(self) -> None:
        self.site = Site.objects.first()

        self.root_page = BasePageFactory.create(title="Start", parent=None)
        self.site.root_page = self.root_page
        self.site.save()

    def test_missing_password_yeilds_401(self) -> None:
        sub_page = BasePageFactory.create(title="Child page", parent=self.root_page)
        page_view_restriction = PageViewRestrictionFactory.create(page=sub_page)

        url = reverse(
            "nextjs:password_protected_page:detail_view",
            args=(page_view_restriction.pk, sub_page.pk),
        )

        response = self.client.post(url)
        self.assertEqual(response.status_code, 401)

    def test_incorrect_password_returns_401(self) -> None:
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

    def test_restriction_from_another_page_returns_404(self) -> None:
        restricted_page = BasePageFactory.create(title="Public", parent=self.root_page)
        other_page = BasePageFactory.create(title="Other", parent=self.root_page)
        page_view_restriction = PageViewRestrictionFactory.create(
            page=restricted_page,
            password="hello",
        )

        url = reverse(
            "nextjs:password_protected_page:detail_view",
            args=(page_view_restriction.pk, other_page.pk),
        )

        response = self.client.post(
            url,
            json.dumps({"password": "hello"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)

    def test_unpublished_page_returns_404(self) -> None:
        draft_page = BasePageFactory.create(
            title="Draft", parent=self.root_page, live=False
        )
        page_view_restriction = PageViewRestrictionFactory.create(
            page=draft_page,
            password="hello",
        )

        url = reverse(
            "nextjs:password_protected_page:detail_view",
            args=(page_view_restriction.pk, draft_page.pk),
        )

        response = self.client.post(
            url,
            json.dumps({"password": "hello"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)

    def test_correct_password_unlocks_page_inheriting_the_restriction(self) -> None:
        parent_page = BasePageFactory.create(title="Parent", parent=self.root_page)
        child_page = BasePageFactory.create(title="Child", parent=parent_page)
        page_view_restriction = PageViewRestrictionFactory.create(
            page=parent_page,
            password="hello",
        )
        page_url = (
            f"{reverse('nextjs:page_by_path:listing')}"
            f"?html_path={child_page.relative_url(self.site)}"
        )

        locked = self.client.get(page_url).json()
        self.assertEqual(locked["component_name"], "PasswordProtectedPage")

        response = self.client.post(
            reverse(
                "nextjs:password_protected_page:detail_view",
                args=(page_view_restriction.pk, child_page.pk),
            ),
            json.dumps({"password": "hello"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 204)

        unlocked = self.client.get(page_url).json()
        self.assertEqual(unlocked["component_props"]["title"], "Child")

    def test_correct_password_returns_no_page_data(self) -> None:
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
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.content, b"")
