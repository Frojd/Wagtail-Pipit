This is a cookiecutter project where we generate headless website running Next.js on frontend and Wagtail/Django on the backend.

The boilerplate generates Next.js using the App Router.

# File structure
- Company-Project - Contains a generated example project generated from {{cookiecutter.project_name}}/
- {{cookiecutter.project_name}}/ - Cookiecutter template, Company-Project is regenerated from it
- hooks - Cookiecutter hooks
- cookiecutter.json - Cookiecutter config
- .github - Contains the CI for the cookiecutter template

# Workflow
- Every commit must be followed by a CHANGELOG.md entry
- The changelog entry cannot be more than 170 chars
- The changelog entry must be a verb
- Keep [Unreleased] free of outdated entries, when a change supersedes an existing [Unreleased] entry (for example a newer version of the same package) update or remove that entry instead of adding a second one
