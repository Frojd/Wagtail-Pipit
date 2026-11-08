from typing import cast

from rest_framework import serializers

from customdocument.models import CustomDocument


class CustomDocumentSerializer(serializers.ModelSerializer[CustomDocument]):
    id = serializers.SerializerMethodField()
    href = serializers.SerializerMethodField()

    _mocked_id: int
    _mocked_url: str

    def get_id(self, obj: CustomDocument) -> int:
        if hasattr(self, "_mocked_id"):
            return self._mocked_id

        return cast(int, obj.pk)

    def get_href(self, obj: CustomDocument) -> str | None:
        if hasattr(self, "_mocked_url"):
            return self._mocked_url

        return obj.file.url if obj.file else None

    class Meta:
        model = CustomDocument
        fields = ["id", "title", "href"]
