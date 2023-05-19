# Working with Wagtails routable pages

Wagtail has a feature called routable pages which lets you serve different type of content from one page, it does this by letting you add custom routes onto a page.

We won't go into detail on how routable pages work since the [Wagtail documentation on routable pages](https://docs.wagtail.io/en/v2.11.1/reference/contrib/routablepage.html) already does a excellent job, this guide will rather show you how to implement them in Pipit.


## Guide

1. Declare a model that adds RoutablePageMixin and extends from our BasePage model. We do this by generating a new page `python manage.py new_page --name=ProductList` and then eidting it so it includes the `RoutablePageMixin`.

```python
from rest_framework.request import Request
from rest_framework.response import Response
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from wagtail_headless_preview.models import HeadlessPreviewMixin

from main.base import BasePage


class ProductListPage(HeadlessPreviewMixin, RoutablePageMixin, BasePage):
    pass
```

2. Proceed to include a "index" route to our page.

```python
class ProductListPage(HeadlessPreviewMixin, RoutablePageMixin, BasePage):

    @route(r'^$')
    def index_route(self, request, *args, **kwargs):
        data = self.get_component_data({"request": request})
        # Decide response depending if called through api or wagtail routing
        response_cls = Response if isinstance(request, Request) else JsonResponse
        return response_cls(data)
```

3. Now comes the interesting bit, here we declare a subroute that will pick up a "product" and serve if on the page using a custom serializer called `ProductListDetailSerializer`.

We also instruct the view to use a new react component called `ProductListDetail` by setting a custom `component_name` in `get_component_data`.


```python
# main/pages/productlist.py
from django.shortcuts import get_object_or_404
...
from example_app.models import Product  # You will need to create this

...


class ProductListPage(HeadlessPreviewMixin, RoutablePageMixin, BasePage):
    ...

    @route(r'^products/(?P<slug>.+)/$')
    def product_detail(self, request, slug=None, *args, **kwargs):
        product = get_object_or_404(Product, slug=slug)

        context = {"request": request, "product": product}
        data = self.get_component_data(
            context=context,
            component_name="ProductListDetail",
            serializer_cls="main.pages.ProductListDetailSerializer",
        )

        # Decide response depending if called through api or wagtail routing
        response_cls = Response if isinstance(request, Request) else JsonResponse
        return response_cls(data)
```

4. In the example below we are referring to a new serializer called `ProductListDetailSerializer` in `main/pages/productlist_serializer.py`, the serializer extends on `ProductListPageSerializer` should look something like this.

```python
# main/pages/productlist_serializer.py
...
from example_app.serializer import ProductSerializer  # You will need to create this
...

class ProductListDetailSerializer(ProductListPageSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = ProductListPage
        fields = ProductListPageSerializer.Meta.fields + [
            "product",
        ]

    def get_product(self, _page):
        product = self.context.get("product")
        return ProductSerializer(product).data
```

5. With this we have created a page, that will pick up and serve product a custom model on the route `/my-page/products/x1000/` through another serializer.


## Full example

```python
# main/pages/productlist.py
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.request import Request
from rest_framework.response import Response
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from wagtail_headless_preview.models import HeadlessPreviewMixin

from example_app.models import Product
from .base import BasePage


class ProductListPage(HeadlessPreviewMixin, RoutablePageMixin, BasePage):
    @route(r'^$')
    def index_route(self, request, *args, **kwargs):
        data = self.get_component_data({"request": request})
        response_cls = Response if isinstance(request, Request) else JsonResponse
        return response_cls(data)

    @route(r'^products/(?P<slug>.+)/$')
    def product_detail(self, request, slug=None, *args, **kwargs):
        product = get_object_or_404(Product, slug=slug)

        data = self.get_component_data(
            context={"request": request, "product": product},
            component_name="ProductListDetail",
            serializer_cls="main.pages.ProductListDetailSerializer",
        )

        response_cls = Response if isinstance(request, Request) else JsonResponse
        return response_cls(data)
```


```python
# main/pages/product_list_serializer.py
from .base_serializer import BasePageSerializer
from . import ProductListPage
from example_app.serializer import ProductSerializer


class ProductListPageSerializer(BasePageSerializer):
    class Meta:
        model = ProductListPage
        fields = BasePageSerializer.Meta.fields


class ProductListDetailSerializer(ProductListPageSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = ProductListPage
        fields = ProductListPageSerializer.Meta.fields + [
            "product",
        ]

    def get_product(self, _page):
        product = self.context["product"]
        return ProductSerializer(product).data
```
