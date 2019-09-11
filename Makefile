NAME=nginx-server
VERSION=1.0
PORT_MAP=80:80
PORT_MAP2=433:433
# NETWORK_NAME=web-network
AWS_ACCOUNT=407205661819
# AWS_REGION=us-east-1
TAG=$(NAME):$(VERSION)
REPO=$(AWS_ACCOUNT).dkr.ecr.$(AWS_REGION).amazonaws.com/$(TAG)
# REPO=$(TAG)

default: buildl

# Build Image for local
buildl:
	docker build -f Dockerfile-dev --rm -t $(TAG) .

# Run locally
runl:
	docker run -d --rm -p 8888:80 --name $(NAME) $(TAG)