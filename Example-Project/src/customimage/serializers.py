from rest_framework import serializers

from customimage.models import CustomImage


class CustomImageSerializer(serializers.ModelSerializer):
    def to_representation(self, obj):
        image = {
            'id': obj.id,
            'title': obj.title,
            'url': obj.file.url if obj.file else None,
            'width': obj.width,
            'height': obj.height,
        }
        return image

    class Meta:
        model = CustomImage
        fields = ['title', 'file', 'width', 'height', 'file_size']
