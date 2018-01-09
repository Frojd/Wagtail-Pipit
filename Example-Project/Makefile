setup:
	git flow init
	cp docker/config/db.example.env docker/config/db.env
	cp docker/config/web.example.env docker/config/web.env
	ln -nfs .githooks/pre-push.sh .git/hooks/pre-push
	ln -nfs .githooks/pep8-pre-commit.sh .git/hooks/pre-commit
	ln -nfs .githooks/bump-version.sh .git/hooks/post-flow-release-start
	ln -nfs .githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
	docker-compose up

fixcode:
	autopep8 -r --in-place --aggressive src
