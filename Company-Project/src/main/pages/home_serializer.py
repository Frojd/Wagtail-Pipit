from . import HomePage
from .base_serializer import BasePageSerializer


class HomePageSerializer(BasePageSerializer):
    class Meta:
        model = HomePage
        fields = BasePageSerializer.Meta.fields
