#!/bin/sh

# Make sure python code is formatted
docker compose run --rm -T python ruff format --check .
docker compose run --rm -T python ruff check .
