from django.templatetags.static import static
from django.utils.html import format_html
from django.utils.safestring import SafeString
from wagtail import hooks


@hooks.register("insert_global_admin_css")
def insert_global_admin_css() -> SafeString:
    return format_html(
        '<link rel="stylesheet" type="text/css" href="{}">',
        static("pipit/admin-overrides.css"),
    )
