from rest_framework import serializers

from .models import Cookie, CookieCategory


class CookieCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CookieCategory
        fields = [
            "name",
            "slug",
        ]


class CookieSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field='slug'
     )

    class Meta:
        model = Cookie
        fields = [
            "name",
            "provider",
            "purpose",
            "expiry",
            "type",
            "category",
        ]
