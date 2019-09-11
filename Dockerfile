# ---- Nginx ----
FROM smebberson/alpine-nginx:latest

RUN apk update
RUN apk add bash

# for testing
# RUN apk add vim

EXPOSE 80
EXPOSE 443