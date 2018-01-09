# -*- coding: utf-8 -*-

'''
Interested in tests? Awesome! Make sure you read this first:

    Writing your first Django app, part 5 (Introducing automated testing)
    - https://docs.djangoproject.com/en/dev/intro/tutorial05/

    pytest: helps you write better programs
    - https://docs.pytest.org/en/latest/

    Database creation/re-use
    - https://pytest-django.readthedocs.io/en/latest/database.html
'''

from django.test import TestCase
from django.core.urlresolvers import reverse

import pytest

from exampleapp.models import Page


class TraditionalDjangoTestCase(TestCase):
    def test_empty_start_endpoint(self):
        response = self.client.get(reverse('startpage'))
        self.assertEqual(response.status_code, 200)

    def test_start_endpoint(self):
        page = Page(title='About', slug='about', content='Hello world!')
        page.save()

        response = self.client.get(
            reverse('page_detail', kwargs={'slug': 'about'})
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'About')


def test_functional_without_db():
    page = Page(title='About', slug='about')
    assert str(page) == 'About'


@pytest.mark.django_db
def test_functional_with_db():
    page = Page(title='About', slug='about')
    page.save()

    assert page.pk == 2
