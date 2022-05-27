from django.test.client import RequestFactory
from wagtail.test.utils import WagtailPageTests
import wagtail_factories

from ..factories.base_page import BasePageFactory


class SeoMixinTest(WagtailPageTests):
    def setUp(self):
        self.site = wagtail_factories.SiteFactory()
        self.factory = RequestFactory(
            SERVER_NAME="{}:{}".format(self.site.hostname, self.site.port)
        )

        self.page = BasePageFactory.create(
            title="Start | Test site",
            seo_title="My start",
            og_title="My og start",
            search_description="Search description",
            og_description="My og description",
            twitter_title="My twitter title",
            twitter_description="My twitter description",
            parent=self.site.root_page,
        )

    def test_common_fields(self):
        self.assertEqual(self.page.seo_html_title, "My start | Test site")
        self.assertEqual(self.page.seo_meta_description, "Search description")
        self.assertEqual(self.page.seo_og_title, "My og start")
        self.assertEqual(self.page.seo_og_description, "My og description")
        self.assertEqual(self.page.seo_og_url, self.page.full_url)
        self.assertEqual(self.page.seo_og_type, None)
        self.assertEqual(self.page.seo_twitter_title, "My twitter title")
        self.assertEqual(self.page.seo_twitter_description, "My twitter description")
        self.assertEqual(self.page.seo_twitter_url, self.page.full_url)
        self.assertEqual(self.page.seo_meta_robots, "index,follow")
