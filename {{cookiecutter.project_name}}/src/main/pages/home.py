from django.utils.translation import gettext_lazy as _

from .base import BasePage


class HomePage(BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.HomePageSerializer"

    class Meta:
        verbose_name = _("Home")
