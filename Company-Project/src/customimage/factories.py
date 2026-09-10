import factory
from factory.django import DjangoModelFactory
from wagtail.images.tests.utils import get_test_image_file

from .models import CustomImage


class CustomImageFactory(DjangoModelFactory):
    title = factory.sequence(lambda x: f"extended-image-{[x]}")
    file = factory.LazyAttribute(lambda _: get_test_image_file())

    class Meta:
        model = CustomImage
