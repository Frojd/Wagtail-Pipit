from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.test import override_settings
from django.test.client import RequestFactory
from rest_framework import serializers
from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from main.factories.base_page import BasePageFactory
from main.models import BasePage, BasePageSerializer

User = get_user_model()


class BasePageTest(WagtailPageTests):
    def test_factories_inheritance(self):
        page = BasePageFactory.create(title="Start", parent=None)
        self.assertIsNotNone(page.id)

        sub_page = BasePageFactory.create(title="Start", parent=page)
        self.assertEqual(sub_page.get_parent().id, page.id)

    def test_to_dict_uses_default_serializer(self):
        page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=page)

        self.assertEqual(page.get_serializer_class(), BasePageSerializer)
        self.assertIn("title", page.to_dict({}))

    def test_to_dict_accepts_override_serializer(self):
        class OverrideSerializer(serializers.ModelSerializer):
            random = serializers.SerializerMethodField()

            class Meta:
                model = BasePage
                fields = [
                    "random",
                ]

            def get_random(self, page):
                return page.title

        page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=page)

        self.assertEqual(page.get_serializer_class(), BasePageSerializer)
        self.assertIn("random", page.to_dict({}, OverrideSerializer))


class BasePageWagtailUserbarTest(WagtailPageTests):
    """
    The userbar is rendered server-side by the wagtailuserbar template tag,
    which only returns markup when request.user has wagtailadmin.access_admin.
    On the SSR page fetch, request.user is resolved by DRF SessionAuthentication
    from the forwarded editor cookie (see REST_FRAMEWORK in settings/base.py).
    """

    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        self.page = BasePageFactory.create(title="A page", parent=self.root_page)
        self.request_factory = RequestFactory()

    def _userbar(self, user, host=None):
        extra = {"HTTP_HOST": host} if host else {}
        request = self.request_factory.get("/", **extra)
        request.user = user
        serializer = BasePageSerializer(self.page, context={"request": request})
        return serializer.get_wagtail_userbar(self.page)

    def test_no_request_returns_none(self):
        serializer = BasePageSerializer(self.page, context={})
        self.assertIsNone(serializer.get_wagtail_userbar(self.page))

    def test_anonymous_user_gets_no_userbar(self):
        self.assertIsNone(self._userbar(AnonymousUser()))

    def test_user_without_admin_access_gets_no_userbar(self):
        visitor = User.objects.create_user(username="visitor", password="pw")
        self.assertIsNone(self._userbar(visitor))

    def test_editor_gets_userbar_html(self):
        editor = User.objects.create_superuser(username="editor", password="pw")
        result = self._userbar(editor)

        self.assertIsNotNone(result)
        self.assertIn("<wagtail-userbar></wagtail-userbar>", result["html"])

    # The rewritten host must be in ALLOWED_HOSTS, since the userbar tag calls
    # request.build_absolute_uri() which validates get_host(). In prod/stage
    # WAGTAILADMIN_BASE_URL's domain is always allowlisted; mirror that here.
    @override_settings(
        WAGTAILADMIN_BASE_URL="http://example.test:8355",
        ALLOWED_HOSTS=["example.test", "testserver"],
    )
    def test_userbar_assets_use_public_host_not_internal_proxy_host(self):
        # The reverse proxy forwards the SSR fetch with an internal Host
        # (":8081") the browser can't reach, so the userbar tag would otherwise
        # bake that unreachable host into the vendor.js/userbar.js <script src>
        # URLs. get_wagtail_userbar must rewrite the host to WAGTAILADMIN_BASE_URL.
        editor = User.objects.create_superuser(username="editor", password="pw")
        result = self._userbar(editor, host="example.test:8081")

        self.assertIsNotNone(result)
        self.assertNotIn(":8081", result["html"])
