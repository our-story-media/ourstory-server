![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/our-story-media/ourstory-server.svg) ![GitHub](https://img.shields.io/github/license/our-story-media/ourstory-server.svg)

AMD64 Build
_auto built for tagged versions on Azure DevOps_

[![Build Status](https://dev.azure.com/ourstorytitan/OurStoryBuilds/_apis/build/status/our-story-media.ourstory-server?branchName=master)](https://dev.azure.com/ourstorytitan/OurStoryBuilds/_build/latest?definitionId=10&branchName=master)

ARM v7 Titan Compact Build (Includes server and worker)
_auto built for tagged versions on CircleCI_

[![CircleCI](https://circleci.com/gh/our-story-media/ourstory-server/tree/rpioutputcontrols.svg?style=svg)](https://circleci.com/gh/our-story-media/ourstory-server/tree/rpioutputcontrols)

# Indaba Server

Indaba is a system to orchestrate multiple users capturing footage for a film shoot.

Each user's native mobile application connects to a Indaba server, which coordinates their actions according to pre-defined shoot templates.

# Docker

Use the DockerHub image /bootlegger/ourstory-server

Indaba starts by default into the Local Server (Titan) mode.

To start an online installation, volume map the following:

- .sailsrc:/usr/src/app/.sailsrc (standard rc file overriding default environment variables)
- ssl/firebase.json:/usr/src/app/ssl/firebase.json (for push notifications)
- ssl/cloudfrontkey.pem:/usr/src/app/ssl/cloudfrontkey.pem
- ssl/cloudfrontpk.pem:/usr/src/app/ssl/cloudfrontpk.pem

# Development

Use the `docker/dev/docker-compose` file provided to start a local development environment. This includes a basic redis, mongodb and Indaba installation with volume maps to the local development files.

Once started with `docker-compose up`, the server will be accesible at [http://localhost:8845]().

## Restoring backup / test data

1. Place `mongodump` data into ./backup
2. Open a terminal into the mongo docker container, and run `mongorestore /backup` to restore data.

File assets need to be placed into `./upload`.

# Production Deployment

Use the `docker/build/docker-compose` file to build and push your images and then deploy using the instructions above.

Runtime External Dependencies for Online Edition:

- Google Developer Account
- Amazon S3 Account
- Amazon Elastic Transcoder Account
- SendGrid Account

# Titan Builds

The `images.tar` and `indaba-update.tar` files, used for the Windows Titan and RPi Titan software can be generated using the scripts in `docker/titan`.

`build-compact.sh` builds the compact RPi docker image (local version of Drone.io process).

To build a new Titan version -- one of the following must be run locally to update the cached tar file on S3.

`uploadtitan-amd64.sh` tags and uploads the Windows x64 Docker tar file.

`uploadtitan-armv7.sh` tags and uploads the RPi armv7 Docker tar file containing titan-compact.

CircleCI build pushes an ARM7 image for tagged build to S3 after building.

# Transcription React App

The transcription portion of this web app is a standalone React app, stored in `/assets/transcription`. See `/assets/transcription/README.md` for details.
