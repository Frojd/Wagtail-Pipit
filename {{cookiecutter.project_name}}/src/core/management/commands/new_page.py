import os

from django.template.loader import render_to_string
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Create a stub page with a page model, a serializer and a test

    Example:
        manage.py new_page --name=News

    Outcome:
        + src/main/pages/news.py
        + src/main/pages/news_serializer.py
    """

    def add_arguments(self, parser):
        parser.add_argument("--name", required=True)

    def add_page(self, project_path, name):
        project = os.path.split(project_path)[-1]
        pages_path = os.path.join(project_path, "pages/")
        page_file = "{pages_path}{name}.py".format(
            pages_path=pages_path,
            name=name.lower(),
        )
        init_file = "{pages_path}__init__.py".format(
            pages_path=pages_path,
            name=name.lower(),
        )

        if os.path.exists(page_file):
            self.stdout.write("Did not create {} as it already exists".format(page_file))
            return False

        page_template = "commands/new_page/page.py.tpl"

        context = {
            "name": name,
            "project": project
        }

        with open(init_file, "a") as f:
            f.write("from .{name} import *  # NOQA\n".format(name=name.lower()))
            f.write("from .{name}_serializer import *  # NOQA\n".format(name=name.lower()))

        self.create_file(page_file, page_template, context)

    def add_serializer(self, project_path, name):
        serializer_path = os.path.join(project_path, "pages/")
        serializer_file = "{serializer_path}{name}_serializer.py".format(
            serializer_path=serializer_path,
            name=name.lower(),
        )

        if os.path.exists(serializer_file):
            self.stdout.write("Did not create {} as it already exists".format(serializer_file))
            return False

        serializer_template = "commands/new_page/serializer.py.tpl"

        context = {
            "name": name
        }

        self.create_file(serializer_file, serializer_template, context)

    def add_test(self, project_path, name):
        test_path = os.path.join(project_path, "tests/")
        test_file = "{test_path}test_{name}_page.py".format(
            test_path=test_path,
            name=name.lower(),
        )

        if os.path.exists(test_file):
            self.stdout.write("Did not create {} as it already exists".format(test_file))
            return False

        test_template = "commands/new_page/test.py.tpl"

        context = {
            "name": name
        }

        self.create_file(test_file, test_template, context)

    def add_factory(self, project_path, name):
        factory_path = os.path.join(project_path, "factories/")
        factory_file = "{factory_path}{name}.py".format(
            factory_path=factory_path,
            name=name.lower(),
        )

        if os.path.exists(factory_file):
            self.stdout.write("Did not create {} as it already exists".format(factory_file))
            return False

        factory_template = "commands/new_page/factory.py.tpl"

        context = {
            "name": name
        }

        self.create_file(factory_file, factory_template, context)

    def create_file(self, file_path, template, context):
        with open(file_path, 'w') as f:
            content = render_to_string(template, context)
            f.write(content)

        self.stdout.write("Created {}".format(file_path))

    def handle(self, *args, **options):
        name = options["name"]
        project_path, _ = os.path.split(os.path.dirname(os.path.dirname(__file__)))

        self.add_page(project_path, name)
        self.add_serializer(project_path, name)
        self.add_test(project_path, name)
        self.add_factory(project_path, name)
