from django.utils.translation import gettext_lazy as _
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import RichTextFieldPanel
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class ArticlePage(HeadlessPreviewMixin, BasePage):
    rich_text = RichTextField(blank=True, null=True, verbose_name=_("Rich text"))

    content_panels = BasePage.content_panels + [RichTextFieldPanel("rich_text")]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.ArticlePageSerializer"

    class Meta:
        verbose_name = _("Article")
