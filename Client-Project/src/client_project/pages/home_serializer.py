from .base_serializer import BasePageSerializer
from . import HomePage


class HomePageSerializer(BasePageSerializer):
    class Meta:
        model = HomePage
        fields = BasePageSerializer.Meta.fields
