from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel
from wagtail.contrib.settings.models import BaseSetting, register_setting
from wagtail.fields import RichTextField


@register_setting
class SiteSetting(BaseSetting):
    gtm_id = models.CharField(max_length=50, blank=True)
    google_site_verification = models.CharField(max_length=255, blank=True)

    cookie_content = RichTextField(
        blank=True, null=True, verbose_name=_("Cookie bar content"), features=[]
    )

    panels = [FieldPanel("gtm_id"), FieldPanel("cookie_content")]

    def __str__(self):
        return str(self.site)

    class Meta:
        verbose_name = _("Site setting")
        verbose_name_plural = _("Site settings")
