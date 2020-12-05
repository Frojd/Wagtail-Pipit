# Adding multi language support

Wagtail and Pipit assumes by default that all content comes in a single language, to add support for multiple languages you need to do the following:

1. Install `wagtail_localize` (`pip install wagtail_localize`)

2. Add `"wagtail_localize"` and `"wagtail_localize.locales"` to `INSTALLED_APPS`

3. Update `src/pipit/settings/base.py` with the following:

```python
WAGTAIL_I18N_ENABLED = True
...
WAGTAIL_CONTENT_LANGUAGES = LANGUAGES = [
    # Any language you whish to support
    ('en', "English"),
    ('sv', "Swedish"),
    ('de', "German"),
]
```

4. Update so you use `i18n_patterns` for routing

```python
from django.conf.urls.i18n import i18n_patterns

urlpatterns += i18n_patterns(
    re_path(r"", include(wagtail_urls)),
)
```

This will make sure languages are served as `example.com/en/about-is.`

5. Done!
