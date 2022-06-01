from django.utils.translation import gettext_lazy as _
from django.views.generic import TemplateView

from main.mixins import ReactViewMixin
from main.serializers import NotFoundPageSerializer


class PageNotFoundView(ReactViewMixin, TemplateView):
    component_name = "NotFoundPage"
    serializer_class = NotFoundPageSerializer

    def render_to_response(self, context, **response_kwargs):
        response = super().render_to_response(context, **response_kwargs)
        response.status_code = 404
        return response

    def get_component_props(self):
        return {"exception": _("Page not found")}
