setup:
	git flow init
	cp docker/config/web.example.env docker/config/web.env
	ln -nfs $(PWD)/.githooks/pre-push.sh .git/hooks/pre-push
	ln -nfs $(PWD)/.githooks/pre-commit.sh .git/hooks/pre-commit
	ln -nfs $(PWD)/.githooks/bump-version.sh .git/hooks/post-flow-release-start
	ln -nfs $(WPD)/.githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
	docker-compose up

test:
	docker-compose run --rm web test

fixcode:
	git diff --name-only --cached "*py" | grep -v /migrations/ | xargs black
	git status -s "*.py" | cut -c4-  | grep -v /migrations/ | xargs black
	git diff --name-only --diff-filter=ACM "*.py" | grep -v /migrations/ | xargs black
