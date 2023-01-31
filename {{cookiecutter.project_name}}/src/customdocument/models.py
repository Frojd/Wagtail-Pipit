from django.contrib.auth import get_user_model
from wagtail.documents.models import Document, AbstractDocument


User = get_user_model()


class CustomDocument(AbstractDocument):
    # Custom field example:

    admin_form_fields = Document.admin_form_fields + (
        # Add all custom fields names to make them appear in the form:
    )

    uploaded_by_user = User
