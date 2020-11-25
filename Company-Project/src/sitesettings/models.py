from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.contrib.settings.models import BaseSetting, register_setting
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField
from wagtail.core.blocks import ChoiceBlock


@register_setting
class SiteSetting(BaseSetting):
    gtm_id = models.CharField(max_length=50, blank=True)
    google_site_verification = models.CharField(max_length=255, blank=True)

    cookie_content = RichTextField(
        blank=True, null=True, verbose_name=_("Cookie bar content"), features=[]
    )

    language = models.CharField(choices=[
        ('sv-SE', 'Swedish'),
        ('en-US', 'English'),
        ('de', 'German'),
    ], default='sv-SE', max_length=5)

    panels = [
        FieldPanel("gtm_id"),
        FieldPanel("cookie_content"),
        FieldPanel('language'),
    ]

    def __str__(self):
        return str(self.site)

    class Meta:
        verbose_name = _("Site setting")
        verbose_name_plural = _("Site settings")
