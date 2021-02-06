# Scaffolding

In Pipit we include a couple of commands to make it easier for you to create the neccessary Wagtail pages and frontend components.


## Creating a Wagtail page

This command will automatically geneate a page along with a corresponding serializer and test. To run it, do this:

```sh
./scripts/manage.sh new_page --name=Article
```

- The following files will be created for you with some default code in them:
    - src/main/pages/article.py
    - src/main/pages/article_serializer.py
    - src/main/tests/test_article_page.py
    - src/main/factories/article_page.py

- After running the scaffold create migrations: `./scripts/manage.py makemigrations`
- And finally migrate your migrations:  `./scripts/manage.py migrate`

## Creating a container component

This command will create a frontend component of the container type (container, something that itself consist of other components, usually a page):

```sh
cd frontend
npm run new:container NewsPage
```

- This will create the following page:
    - `frontend/containers/WordCountPage`


## Creating a component

This command will create a frontend component (something reusable):

```sh
cd frontend
npm run new Button
```
- This will create the following component:
    - `frontend/components/Button`
