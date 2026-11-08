{% raw %}from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager

from ..mixins import HeadlessPreviewPanelMixin
from .base import BasePage


class {{ name }}Page(HeadlessPreviewPanelMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "{{ project }}.pages.{{ name }}PageSerializer"

    objects: PageManager

    class Meta:
        verbose_name = _("{{ name }}"){% endraw %}
