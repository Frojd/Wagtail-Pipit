from typing import List, Dict, Any, Optional, Union, Tuple, Type

from django.utils.module_loading import import_string
from django.http import HttpResponse, JsonResponse
from django.http.request import HttpRequest
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from wagtail.models import Page

from ..mixins import EnhancedEditHandlerMixin, SeoMixin


class BasePage(EnhancedEditHandlerMixin, SeoMixin, Page):
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
        response_cls = Response if isinstance(request, Request) else JsonResponse
        return response_cls(json)

    def get_component_data(
        self,
        context: Optional[Dict],
        component_name: Optional[str] = None,
        serializer_cls: Optional[Union[str, Type[Serializer]]] = None,
    ) -> Dict[str, Any]:
        return {
            "component_name": component_name or self.component_name,
            "component_props": self.to_dict(context, serializer_cls=serializer_cls),
        }

    def to_dict(
        self,
        context: Optional[Dict],
        serializer_cls: Optional[Union[str, Type[Serializer]]] = None,
    ) -> Dict[str, Any]:
        context = context or {}
        dict_serializer_cls: Optional[Type[Serializer]]

        if isinstance(serializer_cls, str):
            dict_serializer_cls = import_string(self.serializer_class)
        else:
            dict_serializer_cls = self.get_serializer_class()

        if not dict_serializer_cls:
            raise Exception("Serializer not found")

        serializer = dict_serializer_cls(self, context=context)
        return serializer.data

    def get_serializer_class(self) -> Type[Serializer]:
        return import_string(self.serializer_class)

    def get_preview_url(self, token):
        """
        Override wagtail_headless_preview/get_preview_url and append hostname
        """
        import urllib

        preview_url = super().get_preview_url(token)
        preview_url = (
            preview_url
            + "&"
            + urllib.parse.urlencode({
                "host": f"{self.get_site().hostname}:{self.get_site().port}"
            })
        )
        return preview_url
