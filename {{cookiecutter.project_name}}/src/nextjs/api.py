from typing import Dict, Union, cast

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.http import Http404, HttpResponseRedirect
from django.middleware import csrf as csrf_middleware
from django.shortcuts import get_object_or_404
from django.urls import path
from django.utils import translation
from django.utils.decorators import method_decorator
from django.utils.module_loading import import_string
from django.views import View
from django.views.decorators.csrf import csrf_protect
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import BaseAPIViewSet, PagesAPIViewSet
from wagtail.contrib.redirects.middleware import get_redirect
from wagtail.contrib.redirects.models import Redirect
from wagtail.forms import PasswordViewRestrictionForm
from wagtail.models import Page, PageViewRestriction, Site
from wagtail.wagtail_hooks import require_wagtail_login
from wagtail_headless_preview.models import PagePreview

api_router = WagtailAPIRouter("nextjs")


class PageRelativeUrlListSerializer(serializers.Serializer):
    def to_representation(self, obj):
        return {
            "title": obj.title,
            "relative_url": obj.get_url(None),
        }


class PageRelativeUrlListAPIViewSet(PagesAPIViewSet):
    """Return all pages and their relative url"""

    def get_serializer(self, qs, many=True):
        return PageRelativeUrlListSerializer(qs, many=many)

    @classmethod
    def get_urlpatterns(cls):
        return [
            path("", cls.as_view({"get": "listing_view"}), name="listing"),
        ]


api_router.register_endpoint("page_relative_urls", PageRelativeUrlListAPIViewSet)


class PagePreviewAPIViewSet(BaseAPIViewSet):
    known_query_parameters = PagesAPIViewSet.known_query_parameters.union(
        ["content_type", "token"]
    )

    def listing_view(self, request):
        page = self.get_object()
        setattr(request, "is_preview", True)

        in_preview_panel = request.GET.get("in_preview_panel", None) == "true"
        setattr(request, "in_preview_panel", in_preview_panel)

        return page.serve(request)

    def get_object(self):
        content_type = self.request.GET.get("content_type")
        if not content_type:
            raise ValidationError({"content_type": "Missing value"})

        app_label, model = content_type.split(".")
        content_type = ContentType.objects.get(app_label=app_label, model=model)

        token = self.request.GET.get("token")
        if not token:
            raise ValidationError({"token": "Missing value"})

        page_preview = PagePreview.objects.get(
            content_type=content_type,
            token=token,
        )
        page = page_preview.as_page()
        if not page.pk:
            # fake primary key to stop API URL routing from complaining
            page.pk = 0

        return page

    @classmethod
    def get_urlpatterns(cls):
        return [
            path("", cls.as_view({"get": "listing_view"}), name="listing"),
        ]


api_router.register_endpoint("page_preview", PagePreviewAPIViewSet)


class PasswordProtectedPageViewSet(BaseAPIViewSet):
    known_query_parameters = BaseAPIViewSet.known_query_parameters.union(
        ["restriction_id", "page_id"]
    )

    @method_decorator(csrf_protect)
    def detail_view(self, request, page_view_restriction_id=None, page_id=None):
        restriction = get_object_or_404(
            PageViewRestriction, id=page_view_restriction_id
        )
        page = get_object_or_404(Page, id=page_id).specific

        post = request.data.copy()
        post["return_url"] = "/required_for_validation"

        form = PasswordViewRestrictionForm(post, instance=restriction)
        if not form.is_valid():
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        restriction.mark_as_passed(request)

        data = page.get_component_data(
            {
                "request": request,
            }
        )
        return Response(data)

    @classmethod
    def get_urlpatterns(cls):
        return [
            path(
                "<int:page_view_restriction_id>/<int:page_id>/",
                cls.as_view({"post": "detail_view"}),
                name="detail_view",
            ),
        ]


api_router.register_endpoint("password_protected_page", PasswordProtectedPageViewSet)


class PageByPathAPIViewSet(BaseAPIViewSet):
    known_query_parameters = BaseAPIViewSet.known_query_parameters.union(["html_path"])

    def listing_view(self, request):
        page, args, kwargs = self.get_object()

        if request.GET.get("host", None):
            request._wagtail_site = self.get_external_site_from_request(request)

        for restriction in page.get_view_restrictions():
            if not restriction.accept_request(request):
                if restriction.restriction_type == PageViewRestriction.PASSWORD:
                    return Response(
                        {
                            "component_name": "PasswordProtectedPage",
                            "component_props": {
                                "restriction_id": restriction.id,
                                "page_id": page.id,
                                "csrf_token": csrf_middleware.get_token(request),
                            },
                        }
                    )

                elif restriction.restriction_type in [
                    PageViewRestriction.LOGIN,
                    PageViewRestriction.GROUPS,
                ]:
                    site = Site.find_for_request(self.request)
                    resp = require_wagtail_login(next=page.relative_url(site, request))
                    return Response(
                        {
                            "redirect": {
                                "destination": resp.url,
                                "is_permanent": False,
                            }
                        }
                    )

        return page.serve(request, *args, **kwargs)

    def get_object(self):
        path = self.request.GET.get("html_path", None)
        if path is None:
            raise ValidationError({"html_path": "Missing value"})

        if not path.startswith("/"):
            path = "/" + path

        if self.request.GET.get("host", None):
            self.request._wagtail_site = self.get_external_site_from_request(
                self.request
            )

        site = Site.find_for_request(self.request)
        if not site:
            raise Http404

        root_page = site.root_page

        path_components = [component for component in path.split("/") if component]

        if getattr(settings, "WAGTAIL_I18N_ENABLED", False):
            language_from_path = translation.get_language_from_path(path)

            if language_from_path:
                path_components.remove(language_from_path)
                translated_root_page = (
                    root_page.get_translations(inclusive=True)
                    .filter(locale__language_code=language_from_path)
                    .first()
                )
                if not translated_root_page:
                    raise Http404

                root_page = translated_root_page

        page, args, kwargs = root_page.specific.route(self.request, path_components)
        return page, args, kwargs

    @classmethod
    def get_external_site_from_request(cls, request):
        from wagtail.models.sites import get_site_for_hostname
        from django.http.request import split_domain_port

        host = request.GET.get("host")
        hostname, port = split_domain_port(host)
        return get_site_for_hostname(hostname, port or 443)

    @classmethod
    def get_urlpatterns(cls):
        return [
            path("", cls.as_view({"get": "listing_view"}), name="listing"),
        ]


api_router.register_endpoint("page_by_path", PageByPathAPIViewSet)


class ExternalViewDataAPIViewSet(BaseAPIViewSet):
    view_register: Dict[str, Union[View, str]] = {
        "404": "main.views.page_not_found.PageNotFoundView",
    }

    def detail_view(self, request, pk):
        try:
            view_resource = self.view_register[pk]
        except KeyError:
            raise Http404

        if isinstance(view_resource, str):
            view_resource = import_string(view_resource)

        view_cls: View = cast(View, view_resource)

        view = view_cls.as_view()
        resp = view(request)

        if resp.status_code in [301, 302, 307]:
            redirect_resp = cast(HttpResponseRedirect, resp)
            return Response(
                {
                    "redirect": {
                        "destination": redirect_resp.url,
                        "is_permanent": redirect_resp.status_code == 301,
                    }
                }
            )

        resp.status_code = 200
        return resp

    @classmethod
    def get_urlpatterns(cls):
        return [
            path("<str:pk>/", cls.as_view({"get": "detail_view"}), name="detail"),
        ]


api_router.register_endpoint("external_view_data", ExternalViewDataAPIViewSet)


class RedirectSerializer(serializers.ModelSerializer):
    destination = serializers.CharField(source="link")

    class Meta:
        model = Redirect
        fields = ["old_path", "destination", "is_permanent"]


class RedirectByPathAPIViewSet(BaseAPIViewSet):
    known_query_parameters = BaseAPIViewSet.known_query_parameters.union(["html_path"])

    def detail_view(self, request):
        redirect = self.get_object()
        serializer = self.get_serializer(redirect, many=False)
        return Response(serializer.data)

    def get_object(self):
        path = self.request.GET.get("html_path", None)
        if path is None:
            raise ValidationError({"html_path": "Missing value"})

        if not path.startswith("/"):
            path = "/" + path

        path = Redirect.normalise_path(path)

        redirect = get_redirect(self.request, path)
        if not redirect:
            raise Http404
        return redirect

    def get_serializer(self, qs, many=True):
        return RedirectSerializer(qs, many=many)

    @classmethod
    def get_urlpatterns(cls):
        return [
            path("", cls.as_view({"get": "detail_view"}), name="detail"),
        ]


api_router.register_endpoint("redirect_by_path", RedirectByPathAPIViewSet)
