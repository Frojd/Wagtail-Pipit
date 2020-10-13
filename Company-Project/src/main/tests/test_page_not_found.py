from django.test import TestCase


class PageNotFoundTest(TestCase):
    def test_that_404_contains_no_errors(self):
        response = self.client.get("/a-404-url/")

        self.assertEqual(response.status_code, 404)

    def test_that_404_view_uses_proper_serializer(self):
        response = self.client.get("/a-404-url/")

        content = response.content.decode("utf-8")
        self.assertTrue("component_name" in content)
