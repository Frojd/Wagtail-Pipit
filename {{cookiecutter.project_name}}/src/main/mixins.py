from typing import Any, Callable, Dict, List, Tuple, Type, Union

from django.db import models
from django.http import JsonResponse
from django.http.request import HttpRequest
from django.utils.functional import cached_property
from django.utils.module_loading import import_string
from django.utils.translation import gettext_lazy as _
from rest_framework.serializers import Serializer
from wagtail.admin.panels import (
    FieldPanel,
    MultiFieldPanel,
    ObjectList,
    Panel,
    PanelGroup,
    TabbedInterface,
    WagtailAdminPageForm,
)
from wagtail.admin.widgets.slug import SlugInput
from wagtail.models import Page
from wagtail.utils.decorators import cached_classmethod
from wagtail_meta_preview.panels import (
    FacebookFieldPreviewPanel,
    GoogleFieldPreviewPanel,
    TwitterFieldPreviewPanel,
)
from wagtail_meta_preview.utils import FacebookSettings, GoogleSettings, TwitterSettings


class RedirectUpMixin:
    get_parent: Callable

    def serve(self, request, *args, **kwargs):
        parent = self.get_parent()
        return JsonResponse(
            {
                "redirect": {
                    "destination": parent.url,
                    "is_permanent": False,
                }
            }
        )


class SeoMixin(Page):
    og_title = models.CharField(
        max_length=40,
        blank=True,
        null=True,
        verbose_name=_("Facebook title"),
        help_text=_("Falls back to seo title if empty"),
    )

    og_description = models.CharField(
        max_length=300,
        blank=True,
        null=True,
        verbose_name=_("Facebook description"),
        help_text=_("Falls back to seo description if empty"),
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
        help_text=_("Falls back to facebook title if empty"),
    )

    twitter_description = models.CharField(
        max_length=300,
        blank=True,
        null=True,
        verbose_name=_("Twitter description"),
        help_text=_("Falls back to facebook description if empty"),
    )

    twitter_image = models.ForeignKey(
        "customimage.CustomImage",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        verbose_name=_("Twitter image"),
        help_text=_("Falls back to facebook image if empty"),
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
        FieldPanel("slug", widget=SlugInput),
        GoogleFieldPreviewPanel(
            [
                FieldPanel("seo_title"),
                FieldPanel("search_description"),
            ],
            heading=_("Google"),
        ),
        FacebookFieldPreviewPanel(
            [
                FieldPanel("og_title"),
                FieldPanel("og_description"),
                FieldPanel("og_image"),
            ],
            heading=_("Facebook"),
        ),
        TwitterFieldPreviewPanel(
            [
                FieldPanel("twitter_title"),
                FieldPanel("twitter_description"),
                FieldPanel("twitter_image"),
            ],
            heading=_("Twitter"),
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

    @cached_property
    def google_setting(self):
        return GoogleSettings(self)

    @cached_property
    def seo_html_title(self):
        title = self.google_setting.get_title()
        site = self.get_site()
        if not site.site_name:
            return title
        return f"{title} | {site.site_name}"

    @cached_property
    def seo_meta_description(self):
        return self.google_setting.get_description()

    @cached_property
    def seo_canonical_link(self):
        return self.canonical_link or self.full_url

    @cached_property
    def facebook_setting(self):
        return FacebookSettings(self)

    @cached_property
    def seo_og_image(self):
        return self.facebook_setting.get_image()

    @cached_property
    def seo_og_title(self):
        return self.facebook_setting.get_title()

    @cached_property
    def seo_og_description(self):
        return self.facebook_setting.get_description()

    @cached_property
    def seo_og_url(self):
        return self.seo_canonical_link

    @cached_property
    def seo_og_type(self):
        return None

    @cached_property
    def twitter_setting(self):
        return TwitterSettings(self)

    @cached_property
    def seo_twitter_title(self):
        return self.twitter_setting.get_title()

    @cached_property
    def seo_twitter_description(self):
        return self.twitter_setting.get_description()

    @cached_property
    def seo_twitter_url(self):
        return self.seo_canonical_link

    @cached_property
    def seo_twitter_image(self):
        return self.twitter_setting.get_image()

    @cached_property
    def seo_meta_robots(self):
        index = "noindex" if self.robot_noindex else "index"
        follow = "nofollow" if self.robot_nofollow else "follow"
        meta_value = "{},{}".format(index, follow)

        return {
            "index": not self.robot_noindex,
            "follow": not self.robot_nofollow,
            "value": meta_value,
        }

    class Meta:
        abstract = True


class EnhancedPanelMixin:
    edit_handler: PanelGroup
    content_panels: List[Panel]
    promote_panels: List[Panel]
    settings_panels: List[Panel]
    extra_panels: List[Tuple[str, str]]
    base_form_class: WagtailAdminPageForm

    @cached_classmethod
    def get_edit_handler(cls) -> Panel:
        """
        Get the Panel to use in the Wagtail admin when editing
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
            tabs.append(
                ObjectList(cls.promote_panels, heading=_("SEO"), classname="seo")
            )

        if cls.settings_panels:
            tabs.append(
                ObjectList(
                    cls.settings_panels, heading=_("Settings"), classname="settings"
                )
            )

        Panel_ = TabbedInterface(tabs, base_form_class=cls.base_form_class)

        return Panel_.bind_to_model(cls)


class TimestampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ReactViewMixin(object):
    request: HttpRequest
    component_name: str
    serializer_class: Union[str, Type[Serializer]]

    def render_to_response(self, context, **response_kwargs):
        props = self.get_component_data({"request": self.request})
        return JsonResponse(props)

    def get_component_data(self, context: Dict) -> Dict[str, Any]:
        return {
            "component_name": self.component_name,
            "component_props": self.to_dict(context),
        }

    def to_dict(self, context: Dict[Any, Any]) -> Dict[str, Any]:
        serializer_cls = self.get_serializer_class()
        serializer = serializer_cls(
            self.get_component_props(),
            context=context,
        )

        return serializer.data

    def get_serializer_class(self) -> Type[Serializer]:
        serializer_class: Type[Serializer]
        if isinstance(self.serializer_class, str):
            serializer_class = import_string(self.serializer_class)
        else:
            serializer_class = self.serializer_class
        return serializer_class

    def get_component_name(self) -> str:
        if getattr(self, "component_name", None):
            return self.component_name

        return self.__class__.__name__

    def get_component_props(self) -> Dict[str, Any]:
        return {}
