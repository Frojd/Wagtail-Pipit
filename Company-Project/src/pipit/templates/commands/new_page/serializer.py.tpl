from . import {{ name }}Page
from .base_serializer import BasePageSerializer


class {{ name }}PageSerializer(BasePageSerializer):
    class Meta:
        model = {{ name }}Page
        fields = BasePageSerializer.Meta.fields

