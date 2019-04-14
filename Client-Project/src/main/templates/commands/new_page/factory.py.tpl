from wagtail_factories import PageFactory

from ..pages.{{ name|lower }} import {{ name }}Page


class {{ name }}PageFactory(PageFactory):
    class Meta:
        model = {{ name }}Page
