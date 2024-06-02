from .base_page import BasePageFactory
from ..pages.{{ file_name }} import {{ name }}Page


class {{ name }}PageFactory(BasePageFactory):
    class Meta:
        model = {{ name }}Page
