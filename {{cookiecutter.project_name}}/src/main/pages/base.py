from django.utils.module_loading import import_string
from wagtail.core.models import Page

from ..mixins import EnhancedEditHandlerMixin, SeoMixin


class BasePage(EnhancedEditHandlerMixin, SeoMixin, Page):
    # Basepage is not anything creatable in admin
    is_creatable = False
    show_in_menus_default = True

    extra_panels = []
    serializer_class = "main.pages.BasePageSerializer"

    def __init__(self, *args, **kwargs):
        self.template = "pages/react.html"
        self.component_name = self.__class__.__name__
        super().__init__(*args, **kwargs)

    def get_context(self, request, *args, **kwargs):
        context = super().get_context(request, *args, **kwargs)

        return {**context, "props": self.to_dict({"request": request})}

    def serve(self, request, *args, **kwargs):
        if self.should_serve_json(request):
            from django.http import JsonResponse

            json = self.to_dict({"request": request})
            return JsonResponse(json)

        return super().serve(request, *args, **kwargs)

    @staticmethod
    def should_serve_json(request):
        return (
            request.GET.get("format", None) == "json"
            or request.content_type == "application/json"
        )

    def to_dict(self, context):
        context = context or {}
        serializer_cls = self.get_serializer_class()
        serializer = serializer_cls(self, context=context)

        return {
            "component_name": self.component_name,
            "component_props": serializer.data,
        }

    def get_serializer_class(self):
        return import_string(self.serializer_class)
