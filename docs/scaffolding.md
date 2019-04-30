# Scaffolding

We provide a scaffolding management command to make it easier
for you to create the neccessary files for a new page.

If you run:

```sh
./scripts/manage.sh new_page --name=Article
```

The following files will be created for you with some default code in them:

* src/project_name/pages/article.py
* src/project_name/pages/article_serializer.py
* src/project_name/tests/test_article_page.py
* src/project_name/factories/article_page.py
