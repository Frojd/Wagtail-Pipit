{% raw %}from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class {{ name }}Page(HeadlessPreviewMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "{{ project }}.pages.{{ name }}PageSerializer"

    class Meta:
        verbose_name = _("{{ name }}"){% endraw %}
