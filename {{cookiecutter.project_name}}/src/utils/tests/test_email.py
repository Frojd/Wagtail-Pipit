from django.core import mail
from django.test import TestCase

from utils.email import send_templated_email


class TestSendTemplatedEmail(TestCase):
    def test_base_page(self):
        self.assertEqual(len(mail.outbox), 0)

        send_templated_email(
            "My subject",
            "no-reply@email.com",
            ["to@email.com"],
            "email/test_send.txt",
            context={"title": "My title", "content": "My content"},
        )

        self.assertEqual(len(mail.outbox), 1)

        self.assertEqual(mail.outbox[0].subject, "My subject")
        self.assertEqual(mail.outbox[0].from_email, "no-reply@email.com")
