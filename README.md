![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/our-story-media/ourstory-server.svg) ![GitHub](https://img.shields.io/github/license/our-story-media/ourstory-server.svg) ![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/bootlegger/ourstory-server.svg) 

# Our Story Server

Our Story is a system to orchestrate multiple users capturing footage for a film shoot. 

Each user's native mobile application connects to a Our Story server, which coordinates their actions according to  pre-defined shoot templates.

# Docker

Use the DockerHub image /bootlegger/ourstory-server

Our Story starts by default into the Local Server (Titan) mode.

To start an online installation, volume map the following:

- .sailsrc:/usr/src/app/.sailsrc (standard rc file overriding default environment variables)
- firebase.json:/usr/src/app/ssl/firebase.json (for push notifications)

# Development

Use the `docker/dev/docker-compose` file provided to start a local development environment. This includes a basic redis, mongodb and Our Story installation with volume maps to the local development files.

Once started with `docker-compose up`, the server will be accesible at [http://localhost]().

# Production Deployment

Use the `docker/build/docker-compose` file to build and push your images and then deploy using the instructions above.

Runtime External Dependencies:

- Google Developer Account (optional)
- Facebook Developer Account (optional)
- Dropbox Developer Account (optional)
- Amazon S3 Account (not required for Titan)
- Amazon Elastic Transcoder Account (not required for Titan)

## Development Notes
Bootlegger is built on the SailsJS (http://sailsjs.org/) MVC engine, which is based on expressjs.

View files are located in `views\<controller>\<view>.ejs`

Controller logic is located in `api\controllers\<controller>.js`

---

![](platform.svg)

Our Story is an open source suite of tools developed by [Open Lab](http://openlab.ncl.ac.uk) that enables community commissioning and contribution of video. See [the website]( https://guide.ourstory.video) for more information.

*Copyright Newcastle University 2016*