from django.utils.html import format_html
from django.templatetags.static import static
from wagtail import hooks
from wagtail.admin.userbar import AccessibilityItem


@hooks.register("insert_global_admin_css")
def insert_global_admin_css():
    return format_html(
        '<link rel="stylesheet" type="text/css" href="{}">',
        static("pipit/admin-overrides.css"),
    )


@hooks.register("construct_wagtail_userbar")
def remove_accessibility_check_from_userbar(request, items):
    items[:] = [x for x in items if not isinstance(x, AccessibilityItem)]
    return items
