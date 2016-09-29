containers_stop_all:
	docker stop $(docker ps -a -q)

containers_rm_all:
	docker rm $(docker ps -a -q)

image_rmi_untagged:
	docker rmi $(docker images | grep "^<none>" | awk "{print $3}")

restart_machine:
	docker-machine restart default
