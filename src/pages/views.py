from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic import ListView
from .models import Page
from pages.forms import PageForm


class StartView(ListView):
    model = Page
    template_name = "pages/startpage.html"


def subpage(request, slug_value):
    page = get_object_or_404(Page, slug=slug_value)

    # Instance will set the default values
    if request.method == 'POST':
        page_form = PageForm(data=request.POST, instance=page)

        if page_form.is_valid():
            page_form.save()
    else:
        page_form = PageForm(instance=page)

    return render_to_response('pages/subpage.html',
                              {
                                  'title': page.title,
                                  'content': page.content,
                                  'page_form': page_form
                              },
                              context_instance=RequestContext(request))
