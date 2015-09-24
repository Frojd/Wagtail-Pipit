from django.db import models


class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    content = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return "%s" % self.title
