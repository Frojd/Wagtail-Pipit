from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from .models import Page


def startpage(request):
    pages = Page.objects.all()
    return render_to_response("pages/startpage.html",
                              {"pages": pages},
                              context_instance=RequestContext(request))


def subpage(request, slug_value):
    page = get_object_or_404(Page, slug=slug_value)

    return render_to_response("pages/subpage.html",
                                {
                                    "title": page.title,
                                    "content": page.content
                                },
                              context_instance=RequestContext(request))