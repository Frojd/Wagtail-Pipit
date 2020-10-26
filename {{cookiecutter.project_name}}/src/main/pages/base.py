from typing import List, Dict, Any, Optional, Union, Tuple

from django.utils.module_loading import import_string
from django.http import HttpResponse, JsonResponse
from django.http.request import HttpRequest
from rest_framework.serializers import Serializer
from wagtail.core.models import Page
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from wagtail_headless_preview.models import HeadlessPreviewMixin

from ..mixins import EnhancedEditHandlerMixin, SeoMixin


class BasePage(HeadlessPreviewMixin, EnhancedEditHandlerMixin, SeoMixin, Page):
    # Basepage is not anything creatable in admin
    is_creatable = False
    show_in_menus_default = True

    extra_panels: List[Tuple[str, str]] = []
    serializer_class = "main.pages.BasePageSerializer"

    def __init__(self, *args, **kwargs):
        self.template = "pages/empty.html"
        self.component_name = self.__class__.__name__
        super().__init__(*args, **kwargs)

    def serve(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        is_preview = getattr(request, "is_preview", False)
        setattr(request, "is_preview", is_preview)

        json = self.get_component_data({"request": request})
        return JsonResponse(json)

    def get_component_data(
        self,
        context: Optional[Dict],
        component_name: Optional[str] = None,
        serializer_cls: Optional[Union[str, Serializer]] = None,
    ) -> Dict[str, Any]:
        return {
            "component_name": component_name or self.component_name,
            "component_props": self.to_dict(context, serializer_cls=serializer_cls),
        }

    def to_dict(
        self,
        context: Optional[Dict],
        serializer_cls: Optional[Union[str, Serializer]] = None,
    ) -> Dict[str, Any]:
        context = context or {}
        if isinstance(serializer_cls, str):
            serializer_cls = import_string(self.serializer_class)
        serializer_cls = serializer_cls or self.get_serializer_class()
        serializer = serializer_cls(self, context=context)
        return serializer.data

    def get_serializer_class(self) -> Serializer:
        return import_string(self.serializer_class)
