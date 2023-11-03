from typing import List, Optional, cast

from rest_framework import serializers
from wagtail.images.shortcuts import get_rendition_or_not_found

from customimage.models import CustomImage


class CustomImageSerializer(serializers.ModelSerializer):
    renditions = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    focal = serializers.SerializerMethodField()

    _mocked_id: int
    _mocked_url: str
    _mocked_renditions: List
    _renditions: List

    def get_id(self, obj) -> int:
        if hasattr(self, "_mocked_id"):
            return self._mocked_id

        return cast(int, obj.pk)

    def get_url(self, obj) -> Optional[str]:
        if hasattr(self, "_mocked_url"):
            return self._mocked_url

        return obj.file.url if obj.file else None

    def get_renditions(self, obj):
        if hasattr(self, "_mocked_renditions"):
            return self._mocked_renditions

        if not hasattr(self, "_renditions"):
            return None

        renditions = {}
        for name, spec in self._renditions:
            rendition = get_rendition_or_not_found(obj, spec)
            renditions[name] = rendition.attrs_dict

        return renditions

    def get_focal(self, obj):
        # Default focal point values
        background_x = 0.5
        background_y = 0.5

        if obj.focal_point_width:
            # Get point relative to image size, make sure it isn't more than 1
            background_x = min(round(obj.focal_point_x / obj.width, 4), 1)
            background_y = min(round(obj.focal_point_y / obj.height, 4), 1)

        return {"x": "{:.2%}".format(background_x), "y": "{:.2%}".format(background_y)}

    class Meta:
        model = CustomImage
        fields = [
            "title",
            "file",
            "width",
            "height",
            "file_size",
            "focal",
            "renditions",
        ]


def get_image_serializer(renditions=None):
    renditions = renditions if renditions else []
    """
    :param renditions: [(renditionName, wagtailspec,)]
    :return: Monkey patched CustomImageSerializer
    For docs regarding supported rendition-params (wagtailspec), see:
    http://docs.wagtail.io/en/v1.13.1/topics/images.html#using-images-in-templates

    example:
    src = get_image_serializer([
        ('rend1', 'fill-200x200',),
        ('rend2', 'min-200x1000',),
    ])(img_instance).data['renditions'].get('rend1')

    """

    class PatchedSerializer(CustomImageSerializer):
        _renditions = renditions

    return PatchedSerializer
