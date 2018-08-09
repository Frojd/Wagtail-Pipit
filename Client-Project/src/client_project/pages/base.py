from wagtail.core.models import Page

from django_react_templatetags.mixins import RepresentationMixin

from ..mixins import SeoMixin


class BasePage(RepresentationMixin, SeoMixin, Page):
    # Basepage is not anything creatable in admin
    is_creatable = False
    show_in_menus_default = True

    def __init__(self, *args, **kwargs):
        self.template = "pages/react.html"
        self.component_name = "{}Page".format(self.__class__.__name__)
        super().__init__(*args, **kwargs)

    def serve(self, request, *args, **kwargs):
        if request.content_type == "application/json":
            from django.http import JsonResponse

            json = self.to_react_representation({"request": request})
            return JsonResponse(json)

        return super().serve(request, *args, **kwargs)
