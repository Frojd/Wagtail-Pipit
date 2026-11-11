import copy
from typing import Any

from django.core.exceptions import DisallowedHost
from django.http import HttpRequest
from rest_framework import serializers
from rest_framework.request import Request
from wagtail.admin.templatetags.wagtailuserbar import wagtailuserbar

from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer

from ..serializers import SeoSerializer
from . import BasePage


def with_public_host(request: HttpRequest | Request) -> HttpRequest | Request:
    """Copy the request with HTTP_HOST set to the browser host forwarded as ?host=,
    so the userbar builds asset and admin URLs the browser can reach"""
    host = request.GET.get("host", "")
    if not host:
        return request

    django_request = request._request if isinstance(request, Request) else request
    public_request = copy.copy(django_request)
    public_request.META = {**django_request.META, "HTTP_HOST": host}
    public_request.META.pop("HTTP_X_FORWARDED_HOST", None)

    try:
        public_request.get_host()
    except DisallowedHost:
        return request

    if not isinstance(request, Request):
        return public_request

    public_drf_request = copy.copy(request)
    public_drf_request._request = public_request
    return public_drf_request


class BasePageSerializer(serializers.ModelSerializer[BasePage]):
    serializer_field_mapping = (
        serializers.ModelSerializer.serializer_field_mapping.copy()
    )

    seo = serializers.SerializerMethodField()
    site_setting = serializers.SerializerMethodField()
    wagtail_userbar = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields: list[str] = [
            "title",
            "last_published_at",
            "seo_title",
            "search_description",
            "seo",
            "site_setting",
            "wagtail_userbar",
        ]

    def get_seo(self, page: BasePage) -> dict[str, Any]:
        return SeoSerializer(page).data

    def get_site_setting(self, page: BasePage) -> dict[str, Any]:
        site_setting = SiteSetting.for_site(page.get_site())
        return SiteSettingSerializer(site_setting).data

    def get_wagtail_userbar(self, page: BasePage) -> dict[str, str] | None:
        request = self.context.get("request", None)
        if not request:
            return None

        if not hasattr(request, "user"):
            return None

        html = wagtailuserbar({"request": with_public_host(request), "self": page})

        if not html:
            return None

        return {
            "html": html,
        }
