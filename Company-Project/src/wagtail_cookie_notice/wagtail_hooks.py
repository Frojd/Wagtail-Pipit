from django.utils.translation import gettext_lazy as _
from wagtail.admin.menu import MenuItem, SubmenuMenuItem, reports_menu, settings_menu
from wagtail.contrib.modeladmin.options import (
    ModelAdmin,
    modeladmin_register
)
from wagtail.core import hooks

from .models import Cookie, CookieCategory

# reports_menu = Menu(
#     register_hook_name='register_reports_menu_item',
#     construct_hook_name='construct_reports_menu'
# )


class CookieModelAdmin(ModelAdmin):
    model = Cookie
    add_to_settings_menu = True
    list_display = ('name', 'provider', 'purpose', 'expiry', 'type')
    list_filter = ('site', 'category')
    search_fields = ('name',)
    menu_order = 1400

modeladmin_register(CookieModelAdmin)


class CookieCategoryModelAdmin(ModelAdmin):
    model = CookieCategory
    add_to_settings_menu = True
    list_display = ('name', 'slug')
    search_fields = ('name',)
    menu_order = 1500

modeladmin_register(CookieCategoryModelAdmin)

