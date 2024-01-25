from typing import Dict, List, Optional

from django.core import mail
from django.template.loader import render_to_string


def send_templated_email(
    subject: str,
    from_email: str,
    to_emails: List[str],
    template_txt: str,
    template_html: Optional[str] = None,
    context: Optional[Dict] = None,
) -> bool:
    """
    Example usage:

    send_templated_email(
        subject='Welcome to our newsletter',
        from_email='no-reply@frojd.se',
        to_emails=[receiver_user.email],
        template_txt="email/welcome_email.txt",
        template_html="email/welcome_email.html",
        context={
            "user": receiver_user,
        },
    )
    """
    context = context or {}
    message = render_to_string(template_txt, context)

    html_message: Optional[str]
    if template_html:
        html_message = render_to_string(template_html, context)
    else:
        html_message = None

    sent = mail.send_mail(
        subject, message, from_email, to_emails, html_message=html_message
    )

    return sent == 1
