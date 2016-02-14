from django.test import TestCase
from django.core.urlresolvers import reverse

from pages.models import Page


# Interested in tests? Awesome! Make sure you read this first:
#   https://docs.djangoproject.com/en/dev/intro/tutorial05/


class ViewTests(TestCase):
    def test_empty_start_endpoint(self):
        response = self.client.get(reverse('startpage'))
        self.assertEqual(response.status_code, 200)

    def test_start_endpoint(self):
        page = Page(title='About', slug='about', content='Hello world!')
        page.save()

        response = self.client.get(reverse('startpage'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'About')
