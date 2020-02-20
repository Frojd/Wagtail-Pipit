from django.utils.translation import gettext_lazy as _

from .base import BasePage


class {{ name }}Page(BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "{{ project }}.pages.{{ name }}PageSerializer"

    class Meta:
        verbose_name = _("{{ name }}")
