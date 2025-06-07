.PHONY: build up down restart logs clean rebuild clean-build

# Docker environment variables
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build and start all services
build:
	docker-compose build --parallel

up:
	docker-compose up

# Build and start in one command
dev: up

# Stop all services
down:
	docker-compose down

# Restart all services
restart: down up

# View logs
logs:
	docker-compose logs -f

# Clean up Docker resources
clean:
	docker-compose down -v
	docker system prune -f

# Full rebuild of all services
rebuild: down build up

# Clean build (removes all caches and rebuilds)
clean-build: clean build up

# Start specific service
start-%:
	docker-compose up $*

# Stop specific service
stop-%:
	docker-compose stop $*

# View logs for specific service
logs-%:
	docker-compose logs -f $*

# Rebuild specific service
rebuild-%:
	docker-compose build $*
	docker-compose up -d $* 