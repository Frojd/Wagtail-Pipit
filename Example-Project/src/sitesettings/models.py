from django.db import models
from django.utils.translation import ugettext_lazy as _
from wagtail.contrib.settings.models import BaseSetting, register_setting
from wagtail.wagtailadmin.edit_handlers import (
    FieldPanel,
)


@register_setting
class SiteSetting(BaseSetting):
    gtm_id = models.CharField(max_length=50, blank=True)

    panels = [
        FieldPanel('gtm_id'),
    ]

    def __str__(self):
        return str(self.site)

    class Meta:
        verbose_name = _('Site setting')
        verbose_name_plural = _('Site settings')
