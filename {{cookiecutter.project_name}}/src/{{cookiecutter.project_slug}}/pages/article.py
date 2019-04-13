from django.utils.translation import ugettext_lazy as _
from django.db import models
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import RichTextFieldPanel, FieldPanel

from .base import BasePage


class ArticlePage(BasePage):
    wysiwyg = RichTextField(blank=True, null=True, verbose_name=_("Wysiwyg"))

    content_panels = BasePage.content_panels + [RichTextFieldPanel("wysiwyg")]

    extra_panels = BasePage.extra_panels
    serializer_class = "{{ cookiecutter.project_slug }}.pages.ArticlePageSerializer"

    class Meta:
        verbose_name = _("Article")
