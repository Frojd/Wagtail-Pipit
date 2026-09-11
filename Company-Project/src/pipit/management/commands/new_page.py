import os
import re

from django.core.management.base import BaseCommand
from django.template.loader import render_to_string


class Command(BaseCommand):
    """
    Create a stub page with a page model, a serializer and a test

    Example:
        manage.py new_page --name=News

    Outcome:
        + src/main/pages/news.py
        + src/main/pages/news_serializer.py
        + src/main/factories/news.py
        + src/main/tests/test_news.py
    """

    def add_arguments(self, parser):
        parser.add_argument("--name", required=True)

    def handle(self, *args, **options):
        name = options["name"]

        name = name.removesuffix("Page")

        self.add_page(name)
        self.add_serializer(name)
        self.add_test(name)
        self.add_factory(name)

    def add_page(self, name, to_app="main"):
        file_name = get_snake_from_pascal_case(name)
        pages_path = os.path.join(to_app, "pages/")

        page_file = f"{pages_path}{file_name}.py"
        init_file = f"{pages_path}__init__.py"

        if os.path.exists(page_file):
            self.stdout.write(
                f"Did not create {page_file} as it already exists"
            )
            return False

        page_template = "commands/new_page/page.py.tpl"

        context = {"name": name, "project": to_app}

        with open(init_file) as f:
            imports = [line.strip() for line in f if line.strip()]

        imports += [
            f"from .{file_name} import *",
            f"from .{file_name}_serializer import *",
        ]

        with open(init_file, "w") as f:
            f.write("\n".join(sorted(set(imports))) + "\n")

        self.create_file(page_file, page_template, context)

    def add_serializer(self, name, to_app="main"):
        file_name = get_snake_from_pascal_case(name)
        serializer_path = os.path.join(to_app, "pages/")
        serializer_file = f"{serializer_path}{file_name}_serializer.py"

        if os.path.exists(serializer_file):
            self.stdout.write(
                f"Did not create {serializer_file} as it already exists"
            )
            return False

        serializer_template = "commands/new_page/serializer.py.tpl"

        context = {"name": name}

        self.create_file(serializer_file, serializer_template, context)

    def add_test(self, name, to_app="main"):
        file_name = get_snake_from_pascal_case(name)
        test_path = os.path.join(to_app, "tests/")
        test_file = f"{test_path}test_{file_name}_page.py"

        if os.path.exists(test_file):
            self.stdout.write(
                f"Did not create {test_file} as it already exists"
            )
            return False

        test_template = "commands/new_page/test.py.tpl"

        factory_imports = sorted(
            [
                "from ..factories.base_page import BasePageFactory",
                f"from ..factories.{file_name}_page import {name}PageFactory",
            ]
        )

        context = {
            "name": name,
            "file_name": file_name,
            "factory_imports": "\n".join(factory_imports),
        }

        self.create_file(test_file, test_template, context)

    def add_factory(self, name, to_app="main"):
        file_name = get_snake_from_pascal_case(name)
        factory_path = os.path.join(to_app, "factories/")
        factory_file = f"{factory_path}{file_name}_page.py"

        if os.path.exists(factory_file):
            self.stdout.write(
                f"Did not create {factory_file} as it already exists"
            )
            return False

        factory_template = "commands/new_page/factory.py.tpl"

        context = {"name": name, "file_name": file_name}

        self.create_file(factory_file, factory_template, context)

    def create_file(self, file_path, template, context):
        with open(file_path, "w") as f:
            content = render_to_string(template, context)
            f.write(content)

        self.stdout.write(f"Created {file_path}")


def get_snake_from_pascal_case(pascal_string: str) -> str:
    snake_string = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", pascal_string).lower()
    return snake_string
