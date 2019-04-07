setup:
	git flow init
	cp docker/config/web.example.env docker/config/web.env
	ln -nfs $(PWD)/.githooks/pre-push.sh .git/hooks/pre-push
	ln -nfs $(PWD)/.githooks/pre-commit.sh .git/hooks/pre-commit
	ln -nfs $(PWD)/.githooks/bump-version.sh .git/hooks/post-flow-release-start
	ln -nfs $(PWD)/.githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
	mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem example.com.test
	cd frontend && npm install && npm run build
	docker-compose up

test:
	docker-compose run --rm web test
	cd frontend && npm run test

fixcode:
	git diff --name-only --cached "*py" | grep -v /migrations/ | xargs black
	git status -s "*.py" | cut -c4-  | grep -v /migrations/ | xargs black
	git diff --name-only --diff-filter=ACM "*.py" | grep -v /migrations/ | xargs black

translate:
	docker-compose exec web bash -c "python manage.py makemessages -l sv_SE"
