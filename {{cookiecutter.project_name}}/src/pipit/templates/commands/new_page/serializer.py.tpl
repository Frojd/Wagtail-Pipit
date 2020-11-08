{% raw %}from .base_serializer import BasePageSerializer
from . import {{ name }}Page


class {{ name }}PageSerializer(BasePageSerializer):
    class Meta:
        model = {{ name }}Page
        fields = BasePageSerializer.Meta.fields
{% endraw %}
