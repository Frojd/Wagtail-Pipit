import factory
from wagtail.images.tests.utils import get_test_image_file

from .models import CustomImage


class CustomImageFactory(factory.DjangoModelFactory):
    title = factory.sequence(lambda x: "extended-image-{0}".format([x]))
    file = factory.LazyAttribute(lambda _: get_test_image_file())

    class Meta:
        model = CustomImage
