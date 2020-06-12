init:
	git flow init
	cp docker/config/web.example.env docker/config/web.env
	ln -nfs $(PWD)/.githooks/pre-push.sh .git/hooks/pre-push
	ln -nfs $(PWD)/.githooks/pre-commit.sh .git/hooks/pre-commit
	ln -nfs $(PWD)/.githooks/bump-version.sh .git/hooks/post-flow-release-start
	ln -nfs $(PWD)/.githooks/bump-version.sh .git/hooks/post-flow-hotfix-start
	mkcert --cert-file docker/files/certs/cert.pem --key-file docker/files/certs/cert-key.pem {{cookiecutter.domain_prod}}.test
	cd frontend && npm install && npm run build
	docker-compose up

test:
	docker-compose run --rm web test
	docker-compose run --rm frontend test

fixcode:
	docker-compose exec web black --exclude "/(\.eggs|\.git|\.hg|\.mypy_cache|\.nox|\.tox|\.venv|_build|buck-out|build|dist|migrations)/" ./

translate:
	docker-compose exec web bash -c "python manage.py makemessages -l sv_SE"

coverage:
	docker-compose exec web coverage run -m pytest --ds=pipit.settings.test
	docker-compose exec web coverage html
