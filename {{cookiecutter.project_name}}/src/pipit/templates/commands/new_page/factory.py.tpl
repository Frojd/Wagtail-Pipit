{% raw %}from ..pages.{{ file_name }} import {{ name }}Page
from .base_page import BasePageFactory


class {{ name }}PageFactory(BasePageFactory):
    class Meta:
        model = {{ name }}Page{% endraw %}
