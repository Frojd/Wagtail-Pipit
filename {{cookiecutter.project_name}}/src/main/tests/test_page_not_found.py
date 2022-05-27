from django.test import TestCase


class PageNotFoundTest(TestCase):
    def test_that_404_contains_no_errors(self):
        response = self.client.get("/a-404-url/")

        self.assertEqual(response.status_code, 404)

    def test_that_404_view_uses_proper_serializer(self):
        response = self.client.get("/a-404-url/")
        response_json = response.json()

        self.assertTrue(response_json["component_name"], "NotFoundPage")
