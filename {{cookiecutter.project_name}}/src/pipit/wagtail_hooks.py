from wagtail.core import hooks
from django.utils.html import format_html
from django.contrib.staticfiles.templatetags.staticfiles import static


@hooks.register("insert_global_admin_css")
def insert_global_admin_css():
    return format_html(
        '<link rel="stylesheet" type="text/css" href="{}">',
        static("pipit/admin-overrides.css"),
    )
