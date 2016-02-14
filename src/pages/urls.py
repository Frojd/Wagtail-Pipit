from django.conf.urls import patterns, url
from views import StartView


urlpatterns = patterns('pages.views',
    # Some basic examples
    # Root startpage eg. http://site.com
    url(r'^$', StartView.as_view(), name='startpage'),

    # Slugged page eg. http://site.com/subpage/
    url(r'^(?P<slug_value>[\w\-]+)/$', 'subpage', name='subpage'),
)
