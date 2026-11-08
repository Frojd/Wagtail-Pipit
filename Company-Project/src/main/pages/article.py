from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel
from wagtail.fields import RichTextField
from wagtail.models import PageManager

from ..mixins import HeadlessPreviewPanelMixin
from .base import BasePage


class ArticlePage(HeadlessPreviewPanelMixin, BasePage):
    rich_text = RichTextField(blank=True, null=True, verbose_name=_("Rich text"))

    content_panels = BasePage.content_panels + [FieldPanel("rich_text")]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.ArticlePageSerializer"

    objects: PageManager

    class Meta:
        verbose_name = _("Article")
