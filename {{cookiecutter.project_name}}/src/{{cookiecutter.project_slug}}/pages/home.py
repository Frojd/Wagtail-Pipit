from django.utils.translation import ugettext_lazy as _

from .base import BasePage


class HomePage(BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "{{ cookiecutter.project_slug }}.pages.HomePageSerializer"

    class Meta:
        verbose_name = _("Home")
