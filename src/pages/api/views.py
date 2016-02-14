# -*- coding: utf-8 -*-

from rest_framework import mixins, generics
from rest_framework.permissions import AllowAny

from pages.api.serializers import PageSerializer


class PageListView(mixins.ListModelMixin, generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PageSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
