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

- This will create `frontend/containers/NewsPage` and register it in `frontend/containers/LazyContainers.js`, so a Wagtail page with the component name `NewsPage` renders it.
- If the name ends with `Page` the matching backend command is printed, `NewsPage` pairs with `new_page --name=News`.

## Creating a component

This command will create a frontend component (something reusable):

```sh
cd frontend
npm run new:component Button
```
- This will create the following component:
    - `frontend/components/Button`

`npm run new` is an alias for `npm run new:component`.

## Options

```sh
npm run new:component Card Header                 # nested, creates frontend/components/Card/Header
npm run new:container Landing CampaignPage        # nested, creates frontend/containers/Landing/CampaignPage
npm run new:component Button -- --dir stories     # creates frontend/stories/Button
npm run new:component -- --help
```

- Names must be PascalCase (letters and digits, starting with an uppercase letter).
- `--dir` must point inside the frontend folder.
- Storybook titles follow the folder structure, `components/Card/Header` shows up as `Components/Card/Header`.

The scaffolding cli lives in `frontend/cli/new.mts` and runs as TypeScript directly on Node 24, the templates are in `frontend/cli/__Component` and `frontend/cli/__Container`. Its tests run with `npm run test:cli`.
