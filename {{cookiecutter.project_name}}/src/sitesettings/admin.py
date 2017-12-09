from django.contrib import admin

from sitesettings.models import SiteSetting


class SiteSettingAdmin(admin.ModelAdmin):
    pass


admin.site.register(SiteSetting, SiteSettingAdmin)
