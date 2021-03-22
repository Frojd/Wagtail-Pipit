from wagtail_factories import PageFactory

from ..pages.home import HomePage


class HomePageFactory(PageFactory):
    class Meta:
        model = HomePage
