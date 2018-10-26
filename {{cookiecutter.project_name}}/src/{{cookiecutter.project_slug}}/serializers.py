from rest_framework import serializers

from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer


class NotFoundPageSerializer(serializers.Serializer):
    exception = serializers.CharField()
    site_setting = serializers.SerializerMethodField()

    def get_site_setting(self, page):
        request = self.context['request']
        site_setting = SiteSetting.for_site(request.site)
        return SiteSettingSerializer(site_setting).data

    @property
    def component_name(self):
        return "NotFoundPage"
