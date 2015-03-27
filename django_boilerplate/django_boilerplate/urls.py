from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_boilerplate.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)

# This is a simple bypass to show a page without a view, remove this in your
# project if you don't have a need for it
from django.views.generic import TemplateView
urlpatterns += patterns('',
        url(r'^$', TemplateView.as_view(template_name='pages/start.html')),
    )
