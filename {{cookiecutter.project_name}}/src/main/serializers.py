from rest_framework import serializers
from wagtail.models import Site

from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer

from .pages import BasePage


class NotFoundPageSerializer(serializers.Serializer):
    exception = serializers.CharField()
    site_setting = serializers.SerializerMethodField()

    def get_site_setting(self, _page):
        request = self.context["request"]
        site = Site.find_for_request(request)
        site_setting = SiteSetting.for_site(site)
        return SiteSettingSerializer(site_setting).data


class SeoSerializer(serializers.ModelSerializer):
    seo_og_image = serializers.SerializerMethodField()
    seo_twitter_image = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields = [
            "seo_og_image",
            "seo_html_title",
            "seo_meta_description",
            "seo_og_title",
            "seo_og_description",
            "seo_og_url",
            "seo_og_type",
            "seo_twitter_title",
            "seo_twitter_description",
            "seo_twitter_image",
            "seo_meta_robots",
            "seo_canonical_link",
        ]

    def get_seo_og_image(self, page):
        root_url = page.get_site().root_url
        image = page.seo_og_image

        if not image:
            return None

        return f"{root_url}{image}"

    def get_seo_twitter_image(self, page):
        root_url = page.get_site().root_url
        image = page.seo_twitter_image

        if not image:
            return None

        return f"{root_url}{image}"
