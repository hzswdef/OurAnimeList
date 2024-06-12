LOCAL_COMPOSE_COMMAND = docker-compose -f ./environments/localhost/docker-compose.yml --env-file ./environments/localhost/.env
# @TODO Remove once everything will be in Docker.
PRODUCTION_COMPOSE_COMMAND = docker-compose -f ./environments/production/docker-compose.yml --env-file ./environments/production/.env

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

# @TODO Remove once everything will be in Docker.
prod-up:
	$(PRODUCTION_COMPOSE_COMMAND) up -d

prod-start:
	$(PRODUCTION_COMPOSE_COMMAND) start

prod-stop:
	$(PRODUCTION_COMPOSE_COMMAND) stop

prod-restart:
	$(PRODUCTION_COMPOSE_COMMAND) stop
	$(PRODUCTION_COMPOSE_COMMAND) start

prod-rm:
	$(PRODUCTION_COMPOSE_COMMAND) stop
	$(PRODUCTION_COMPOSE_COMMAND) rm -f

prod-logs:
	$(PRODUCTION_COMPOSE_COMMAND) logs -f
