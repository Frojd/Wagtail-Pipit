from wagtail.documents.models import AbstractDocument, Document


class CustomDocument(AbstractDocument):
    # Custom field example:
    # source = models.CharField(
    #     max_length=255,
    #     blank=True,
    #     null=True
    # )

    admin_form_fields = Document.admin_form_fields + (
        # Add all custom fields names to make them appear in the form:
        # "source",
    )
