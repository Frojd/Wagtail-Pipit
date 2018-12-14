from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.http import HttpResponseRedirect
from wagtail.utils.decorators import cached_classmethod
from wagtail.admin.edit_handlers import (
    ObjectList,
    TabbedInterface,
    FieldPanel,
    MultiFieldPanel,
)
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.core.models import Page


class RedirectUpMixin:
    def serve(self, request, *args, **kwargs):
        parent = self.get_parent()
        return HttpResponseRedirect(parent.url)


class SeoMixin(Page):
    og_title = models.CharField(
        max_length=40,
        blank=True,
        null=True,
        verbose_name=_("Facebook title"),
        help_text=_("Fallbacks to seo title if empty"),
    )

    og_description = models.CharField(
        max_length=300,
        blank=True,
        null=True,
        verbose_name=_("Facebook description"),
        help_text=_("Fallbacks to seo description if empty"),
    )

    og_image = models.ForeignKey(
        "customimage.CustomImage",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        help_text=_(
            "If you want to override the image used on Facebook for \
                    this item, upload an image here. \
                    The recommended image size for Facebook is 1200 × 630px"
        ),
        related_name="+",
    )

    twitter_title = models.CharField(
        max_length=40,
        blank=True,
        null=True,
        verbose_name=_("Twitter title"),
        help_text=_("Fallbacks to facebook title if empty"),
    )

    twitter_description = models.CharField(
        max_length=300,
        blank=True,
        null=True,
        verbose_name=_("Twitter description"),
        help_text=_("Fallbacks to facebook description if empty"),
    )

    twitter_image = models.ForeignKey(
        "customimage.CustomImage",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name=_("Twitter image"),
        help_text=_("Fallbacks to facebook image if empty"),
    )

    robot_noindex = models.BooleanField(
        default=False,
        verbose_name=_("No index"),
        help_text=_("Check to add noindex to robots"),
    )

    robot_nofollow = models.BooleanField(
        default=False,
        verbose_name=_("No follow"),
        help_text=_("Check to add nofollow to robots"),
    )

    canonical_link = models.URLField(
        blank=True, null=True, verbose_name=_("Canonical link")
    )

    promote_panels = [
        FieldPanel("slug"),
        MultiFieldPanel(
            [FieldPanel("seo_title"), FieldPanel("search_description")],
            _("SEO settings"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("og_title"),
                FieldPanel("og_description"),
                ImageChooserPanel("og_image"),
                FieldPanel("twitter_title"),
                FieldPanel("twitter_description"),
                ImageChooserPanel("twitter_image"),
            ],
            _("Social settings"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("robot_noindex"),
                FieldPanel("robot_nofollow"),
                FieldPanel("canonical_link"),
            ],
            _("Robot settings"),
        ),
    ]

    og_image_list = ["og_image"]

    def get_og_image(self):
        images = [getattr(self, x) for x in self.og_image_list]
        images = list(filter(None.__ne__, images))

        if not len(images):
            return None

        return images[0]

    def get_html_title(self):
        return self.seo_title or self.title

    def get_meta_description(self):
        return self.search_description

    def get_og_title(self):
        return self.og_title or self.title

    def get_og_description(self):
        return self.og_description or self.title

    def get_og_url(self):
        return self.canonical_link or self.full_url

    def get_og_type(self):
        return None

    def get_twitter_title(self):
        return self.twitter_title or self.title

    def get_twitter_description(self):
        return self.twitter_description

    def get_twitter_url(self):
        return self.canonical_link or self.full_url

    def get_twitter_image(self):
        return self.twitter_image or self.get_og_image()

    def get_meta_robots(self):
        index = "noindex" if self.robot_noindex else "index"
        follow = "nofollow" if self.robot_nofollow else "follow"
        return '{},{}'.format(index, follow)

    class Meta:
        abstract = True


class EnhancedEditHandlerMixin:
    @cached_classmethod
    def get_edit_handler(cls):
        """
        Get the EditHandler to use in the Wagtail admin when editing
        this page type.
        """

        if hasattr(cls, "edit_handler"):
            return cls.edit_handler.bind_to_model(cls)

        # construct a TabbedInterface made up of content_panels, promote_panels
        # and settings_panels, skipping any which are empty
        tabs = []

        if cls.content_panels:
            tabs.append(ObjectList(cls.content_panels, heading=_("Content")))

        if hasattr(cls, "extra_panels"):
            for panel_id, heading in cls.extra_panels:
                tabs.append(ObjectList(getattr(cls, panel_id), heading=heading))

        if cls.promote_panels:
            tabs.append(ObjectList(cls.promote_panels, heading=_("Promote")))

        if cls.settings_panels:
            tabs.append(
                ObjectList(
                    cls.settings_panels, heading=_("Settings"), classname="settings"
                )
            )

        EditHandler = TabbedInterface(tabs, base_form_class=cls.base_form_class)

        return EditHandler.bind_to_model(cls)


class TimestampMixin(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
