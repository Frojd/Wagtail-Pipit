{% raw %}from .base_page import BasePageFactory
from ..pages.{{ name|lower }} import {{ name }}Page


class {{ name }}PageFactory(BasePageFactory):
    class Meta:
        model = {{ name }}Page{% endraw %}
