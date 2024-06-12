LOCAL_COMPOSE_COMMAND = docker-compose -f ./environments/localhost/docker-compose.yml --env-file ./environments/localhost/.env

up:
	$(LOCAL_COMPOSE_COMMAND) up -d

start:
	$(LOCAL_COMPOSE_COMMAND) start

stop:
	$(LOCAL_COMPOSE_COMMAND) stop

restart:
	$(LOCAL_COMPOSE_COMMAND) stop
	$(LOCAL_COMPOSE_COMMAND) start

rm:
	$(LOCAL_COMPOSE_COMMAND) stop
	$(LOCAL_COMPOSE_COMMAND) rm -f

logs:
	$(LOCAL_COMPOSE_COMMAND) logs -f
