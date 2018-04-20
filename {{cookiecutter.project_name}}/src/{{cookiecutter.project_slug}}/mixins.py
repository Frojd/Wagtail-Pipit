from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.http import HttpResponseRedirect

from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.core.models import Page

from sitesettings.models import SiteSetting


class RedirectUpMixin():
    def serve(self, request, *args, **kwargs):
        parent = self.get_parent()
        return HttpResponseRedirect(parent.url)


class SeoMixin(Page):
    og_title = models.CharField(
        max_length=40,
        blank=True,
        null=True,
        verbose_name=_('Facebook title'),
        help_text=_('Fallbacks to seo title if empty')
    )

    og_description = models.CharField(
        max_length=300,
        blank=True,
        null=True,
        verbose_name=_('Facebook description'),
        help_text=_('Fallbacks to seo description if empty')
    )

    og_image = models.ForeignKey(
        'customimage.CustomImage',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        help_text=_('If you want to override the image used on Facebook for \
                    this item, upload an image here. \
                    The recommended image size for Facebook is 1200 × 630px'),
        related_name='+'
    )

    twitter_title = models.CharField(
        max_length=40,
        blank=True,
        null=True,
        verbose_name=_('Twitter title'),
        help_text=_('Fallbacks to facebook title if empty')
    )

    twitter_description = models.CharField(
        max_length=300,
        blank=True,
        null=True,
        verbose_name=_('Twitter description'),
        help_text=_('Fallbacks to facebook description if empty')
    )

    twitter_image = models.ForeignKey(
        'customimage.CustomImage',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name=_('Twitter image'),
        help_text=_('Fallbacks to facebook image if empty')
    )

    robot_noindex = models.BooleanField(
        default=False,
        verbose_name=_('No index'),
        help_text=_('Check to add noindex to robots')
    )

    robot_nofollow = models.BooleanField(
        default=False,
        verbose_name=_('No follow'),
        help_text=_('Check to add nofollow to robots')
    )

    canonical_link = models.URLField(
        blank=True,
        null=True,
        verbose_name=_('Canonical link')
    )

    promote_panels = [
        ImageChooserPanel('og_image'),
    ]

    og_image_list = ['og_image']

    def get_og_image(self):
        default_og_image = SiteSetting.for_site(self.get_site()).og_image

        images = [getattr(self, x) for x in self.og_image_list]
        images.append(default_og_image)
        images = list(filter(None.__ne__, images))

        if not len(images):
            return None

        return images[0]

    class Meta:
        abstract = True


class CreateUpdateModelMixin(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
