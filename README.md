![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/our-story-media/ourstory-server.svg) ![GitHub](https://img.shields.io/github/license/our-story-media/ourstory-server.svg) ![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/bootlegger/ourstory-server.svg) 

# Our Story Server

Our Story is a system to orchestrate multiple users capturing footage for a film shoot. 

Each user's native mobile application connects to a Our Story server, which coordinates their actions according to  pre-defined shoot templates.

# Docker

Use the DockerHub image /bootlegger/ourstory-server

Our Story starts by default into the Local Server (Titan) mode.

To start an online installation, volume map the following:

- .sailsrc:/usr/src/app/.sailsrc (standard rc file overriding default environment variables)
- ssl/firebase.json:/usr/src/app/ssl/firebase.json (for push notifications)
- ssl/cloudfrontkey.pem:/usr/src/app/ssl/cloudfrontkey.pem
- ssl/cloudfrontpk.pem:/usr/src/app/ssl/cloudfrontpk.pem

# Development

Use the `docker/dev/docker-compose` file provided to start a local development environment. This includes a basic redis, mongodb and Our Story installation with volume maps to the local development files.

Once started with `docker-compose up`, the server will be accesible at [http://localhost]().

# Production Deployment

Use the `docker/build/docker-compose` file to build and push your images and then deploy using the instructions above.

Runtime External Dependencies for Online Edition:

- Google Developer Account
- Dropbox Developer Account
- Amazon S3 Account
- Amazon Elastic Transcoder Account
- SendGrid Account

## Development Notes
Our Story is built on the SailsJS (http://sailsjs.org/) MVC engine, which is based on expressjs.

View files are located in `views\<controller>\<view>.ejs`

Controller logic is located in `api\controllers\<controller>.js`
