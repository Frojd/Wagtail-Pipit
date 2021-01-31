from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.contrib.settings.models import BaseSetting, register_setting
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField
from wagtail.core.models import Site, Orderable


@register_setting
class CookieNoticeSetting(BaseSetting):
    title = models.CharField(max_length=255, blank=True)
    content = RichTextField(
        blank=True, null=True, features=[]
    )

    panels = [
        FieldPanel("title"),
        FieldPanel("content"),
    ]

    def __str__(self):
        return str(self.site)

    class Meta:
        verbose_name = _("Cookie notice setting")
        verbose_name_plural = _("Cookie notice settings")


class CookieCategory(Orderable):
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Cookie(Orderable):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255, blank=True)
    purpose = models.CharField(max_length=255, blank=True)
    expiry = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=255, blank=True)
    category = models.ForeignKey(CookieCategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
