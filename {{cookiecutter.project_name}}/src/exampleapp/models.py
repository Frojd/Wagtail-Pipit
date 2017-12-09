# -*- coding: utf-8 -*-

from django.db import models


class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    content = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title
