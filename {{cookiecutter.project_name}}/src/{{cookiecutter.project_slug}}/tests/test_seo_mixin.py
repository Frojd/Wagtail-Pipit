from django.test.client import RequestFactory
from wagtail.tests.utils import WagtailPageTests
import wagtail_factories

from ..factories import BasePageFactory


class SeoMixinTest(WagtailPageTests):
    def setUp(self):
        self.site = wagtail_factories.SiteFactory()
        self.factory = RequestFactory(
            SERVER_NAME='{}:{}'.format(self.site.hostname, self.site.port)
        )

        self.page = BasePageFactory.create(
            title="Start",
            seo_title="My start",
            og_title="My og start",
            search_description="Search description",
            og_description="My og description",
            twitter_title='My twitter title',
            twitter_description='My twitter description',
            parent=self.site.root_page,
        )

    def test_common_fields(self):
        self.assertEqual(self.page.seo_html_title, "My start")
        self.assertEqual(self.page.seo_meta_description, "Search description")
        self.assertEqual(self.page.seo_og_title, "My og start")
        self.assertEqual(self.page.seo_og_description, "My og description")
        self.assertEqual(self.page.seo_og_url, self.page.full_url)
        self.assertEqual(self.page.seo_og_type, None)
        self.assertEqual(self.page.seo_twitter_title, 'My twitter title')
        self.assertEqual(self.page.seo_twitter_description, 'My twitter description')
        self.assertEqual(self.page.seo_twitter_url, self.page.full_url)
        self.assertEqual(self.page.seo_meta_robots, "index,follow")

    def test_partial_print(self):
        request = self.factory.get(self.page.url)
        request.site = self.site

        resp = self.page.serve(request)
        self.assertContains(resp, '<title>My start</title>')
        self.assertContains(
            resp,
            '<meta property="og:description" content="{}" />'.format(
                "My og description"
            )
        )
