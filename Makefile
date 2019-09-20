include .env

NAME=gsales-server
VERSION=1.0
PORT_MAP=80:80
PORT_MAP2=433:433
NETWORK_NAME=web-network
AWS_ACCOUNT=407205661819
AWS_REGION=ca-central-1
TAG=$(NAME):$(VERSION)
REPO=$(AWS_ACCOUNT).dkr.ecr.$(AWS_REGION).amazonaws.com/$(TAG)
# REPO=$(TAG)


default: buildl

# Build Image for local
buildl:
	docker build -f Dockerfile-dev --rm -t $(TAG) .

netwk:
	docker network create $(NETWORK_NAME)

# Run locally
runl:
	docker run -d --rm -p 8888:80 -p 3101:3101 -e NODE_ENV=development -e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
	-e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) --name $(NAME) $(TAG)

# Not certain this is working
login:
	@aws ecr get-login --no-include-email --region ca-central-1

tag:
	docker tag $(TAG) $(REPO)

push:
	docker push $(REPO)

clearrep:
	docker rmi $(REPO)

pushclean: login tag push clearrep

#docker run -d --rm -p 8888:80 -p 3101:3101 -e NODE_ENV=development -e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
#	-e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) --name $(NAME) $(TAG)