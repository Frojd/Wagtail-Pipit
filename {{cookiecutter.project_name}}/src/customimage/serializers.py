from rest_framework import serializers

from customimage.models import CustomImage


class CustomImageSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        # Default focal point values
        background_x = .5
        background_y = .5

        if obj.focal_point_width:
            # Get point relative to image size, make sure it isn't more than 1
            background_x = min(round(obj.focal_point_x / obj.width, 4), 1)
            background_y = min(round(obj.focal_point_y / obj.height, 4), 1)

        image = {
            'id': obj.id,
            'title': obj.title,
            'url': obj.file.url if obj.file else None,
            'width': obj.width,
            'height': obj.height,
            'focal': {
                'x': "{:.2%}".format(background_x),
                'y': "{:.2%}".format(background_y),
            },
        }
        return image

    class Meta:
        model = CustomImage
        fields = ['title', 'file', 'width', 'height', 'file_size']
