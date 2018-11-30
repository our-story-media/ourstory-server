# Docker

Use the image at openlab.ncl.ac.uk:4567/bootlegging/server-app

Volume map with your configuration:

- /usr/src/app/config/local.js
- /usr/src/app/ssl

# Bootlegger Server

Bootlegger is a system to orchestrate multiple users capturing footage for a film shoot either. Multiple direction and commissioning engines are available including real-time shot allocation and individual user feedback on shot quality and their performance. 

Each user's native mobile application connects to a Bootlegger server, which coordinates their actions according to a pre-defined shoot templates.

![](doc_defines/architecture.png "Bootlegger Architecture")

# Development

Use the docker-compose files provided to start a local development environment. This includes a basic redis, mongodb and bootlegger installation.

Make sure to copy the `config\local.example` file to `config\local.js` and fill in any missing details before building the docker container.

To get a basic setup for debugging, you only need to fill in either a Google or Facebook oauth client secret, and an admin email address (which is the email of the account you want to login as super-admin). 

Once started with `docker-compose up`, the server will be accesible at [http://localhost:1337](). 

# Production Deployment
Runtime Dependencies:

- Node.js https://nodejs.org/
- MongoDB https://www.mongodb.org/
- Redis http://redis.io/
- Google Developer Account (optional)
- Facebook Developer Account (optional)
- Dropbox Developer Account (optional)
- Beanstalk http://kr.github.io/beanstalkd/
- Amazon S3 Account
- Amazon Elastic Transcoder Account

## Setting Up Development

- Copy config/local.example.js to config/local.js and fill in missing information, including your Mongo and Redis, Google and S3 connection details.

## Production Deployment

We advise using `pm2` or similar keep your server running.

To start in production mode (which minifiys and concats all resources), use the `--prod` switch when starting pm2 e.g. `pm2 start app.js -- --prod`

In production mode, you will need to run a reverse proxy in front of the Bootlegger server to serve static assets. An example nginx config file is provided in the repo for this purpose.  

## Starting the Server
Running bootlegger on your local machine:
`node app.js`

Running a 'live' server:
`node app.js --prod`

Pointing your browser at `http://localhost` will give you the website.

When using sails, you will have to close and restart the server after any changes to controller files `CTL+C`. Edits to view files should not require a restart.

## Development Notes
Bootlegger is built on the SailsJS (http://sailsjs.org/) MVC engine, which is based on expressjs.

View files are located in `views\<controller>\<view>.ejs`

Controller logic is located in `api\controllers\<controller>.js`

---

![](doc_defines/platform.png)

Bootlegger is an open source suite of tools developed by [Open Lab](http://openlab.ncl.ac.uk) that enables community commissioning and contribution of video. See [the website]( https://bootlegger.tv/platform) for more information.

*Copyright Newcastle University 2016*