from django.http import HttpResponseNotFound
from django.template import loader

from {{cookiecutter.project_slug}}.serializers import NotFoundPageSerializer


def page_not_found(request, exception, template_name='pages/react.html'):
    serializer_context = {
        "request": request,
    }

    serializer = NotFoundPageSerializer({
        "exception": str(exception)
    }, context=serializer_context)

    context = {
        'page': {
            "component_name": serializer.component_name,
            "component_data": serializer.data,
        }
    }

    template = loader.get_template(template_name)
    body = template.render(context, request)
    return HttpResponseNotFound(body, content_type=None)
