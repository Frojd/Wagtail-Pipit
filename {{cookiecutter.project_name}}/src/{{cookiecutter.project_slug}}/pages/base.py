from wagtail.core.models import Page

from django_react_templatetags.mixins import RepresentationMixin

from ..mixins import EnhancedEditHandlerMixin, SeoMixin


class BasePage(RepresentationMixin, EnhancedEditHandlerMixin, SeoMixin, Page):
    # Basepage is not anything creatable in admin
    is_creatable = False
    show_in_menus_default = True

    def __init__(self, *args, **kwargs):
        self.template = "pages/react.html"
        self.component_name = "{}Page".format(self.__class__.__name__)
        super().__init__(*args, **kwargs)

    def serve(self, request, *args, **kwargs):
        if self.should_serve_json(request):
            from django.http import JsonResponse
            json = self.to_react_representation({"request": request})
            return JsonResponse(json)

        return super().serve(request, *args, **kwargs)

    @staticmethod
    def should_serve_json(request):
        return request.GET.get("format", None) == "json" or \
            request.content_type == "application/json"
