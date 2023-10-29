from rest_framework import serializers
from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from main.factories.base_page import BasePageFactory
from main.models import BasePage, BasePageSerializer


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
