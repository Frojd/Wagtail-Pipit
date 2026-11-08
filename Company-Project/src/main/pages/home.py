from django.utils.translation import gettext_lazy as _
from wagtail.models import PageManager

from ..mixins import HeadlessPreviewPanelMixin
from .base import BasePage


class HomePage(HeadlessPreviewPanelMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.HomePageSerializer"

    objects: PageManager

    class Meta:
        verbose_name = _("Home")
