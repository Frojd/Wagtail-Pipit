import factory
from factory.django import DjangoModelFactory
from wagtail.images.tests.utils import get_test_image_file

from .models import CustomImage


class CustomImageFactory(DjangoModelFactory):
    title = factory.sequence(lambda x: "extended-image-{0}".format([x]))
    file = factory.LazyAttribute(lambda _: get_test_image_file())

    class Meta:
        model = CustomImage
