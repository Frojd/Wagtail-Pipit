from wagtail.documents.models import Document, AbstractDocument


class CustomDocument(AbstractDocument):
    # Custom field example:

    admin_form_fields = Document.admin_form_fields + (
        # Add all custom fields names to make them appear in the form:
    )
