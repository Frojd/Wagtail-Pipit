from typing import List

from rest_framework import serializers
from wagtail.admin.templatetags.wagtailuserbar import wagtailuserbar
from wagtail.core import fields
from wagtail.core.models import Locale
from wagtail.api.v2 import serializers as wagtail_serializers

from wagtail_cookie_notice.models import (
    CookieNoticeSetting,
    Cookie,
    CookieCategory,
)
from wagtail_cookie_notice.serializers import (
    CookieSerializer,
    CookieCategorySerializer,
)
from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer
from ..serializers import SeoSerializer
from . import BasePage


class BasePageSerializer(serializers.ModelSerializer):
    serializer_field_mapping = (
        serializers.ModelSerializer.serializer_field_mapping.copy()
    )
    serializer_field_mapping.update(
        {fields.StreamField: wagtail_serializers.StreamField}
    )

    seo = serializers.SerializerMethodField()
    site_setting = serializers.SerializerMethodField()
    wagtail_userbar = serializers.SerializerMethodField()
    cookie_notice = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields: List[str] = [
            "title",
            "last_published_at",
            "seo_title",
            "search_description",
            "seo",
            "site_setting",
            "wagtail_userbar",
            "cookie_notice",
        ]

    def get_seo(self, page):
        return SeoSerializer(page).data

    def get_site_setting(self, page):
        site_setting = SiteSetting.for_site(page.get_site())
        return SiteSettingSerializer(site_setting).data

    def get_wagtail_userbar(self, page):
        request = self.context.get("request", None)
        if not request:
            return None

        if not hasattr(request, "user"):
            return None

        html = wagtailuserbar({"request": request, "self": page})
        if not html:
            return None

        return {
            "html": html,
        }

    def get_cookie_notice(self, page):
        site = page.get_site()
        setting = CookieNoticeSetting.for_site(site)
        cookies = Cookie.objects.filter(site=site).select_related('category')
        cookie_categories = (
            CookieCategory.objects.all()
        )

        return {
            "title": setting.title,
            "content": setting.content,
            "cookies": CookieSerializer(cookies, many=True).data,
            "categories": CookieCategorySerializer(cookie_categories, many=True).data,
        }

