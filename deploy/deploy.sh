#!/bin/sh

. $HOME/.bashrc

S3_BUCKET="s3://gsales-staging-fe-origin/"

# Commands
CP="/bin/cp"
ECHO="/bin/echo"
PRT="/usr/bin/printf"
RM="/bin/rm"

# Vars
SITE="Gales Sales Client"
SEP="=========================================================================="

$PRT "%s\n" $SEP
$PRT "  %s\n" "-- $SITE Deploy --"
$PRT " %s\n" "Location: $S3_BUCKET"
$PRT "%s\n" $SEP

$PRT "stand by building...\n"
mycd ./deploy
$ECHO `yarn build`

$RM -f ./artifacts/*.js
$RM -fr ./artifacts/static/js/*
$CP -a ../build/* ./artifacts/
# $CP ./appspec.yml ./artifacts/

$PRT "\nFinished build stage\n"

$PRT "Uploading files to S3\n"
$ECHO `aws s3 sync ./artifacts/ $S3_BUCKET --delete`
