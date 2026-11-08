from rest_framework import serializers

from sitesettings.models import SiteSetting


class SiteSettingSerializer(serializers.ModelSerializer[SiteSetting]):
    class Meta:
        model = SiteSetting
        fields = ["gtm_id", "cookie_content"]
