# USER-MANAGEMENT-BACKEND-AP
test

This is backend API server for `Arrow-UP` App.

## Requirements

For local setup
, you will need the following installed on your system :-


dsfdsfsdfdsfsd




- Node.js >= 16.13.2
- NPM 8.1.2
- PostgreSQL 12.12 

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.13.2

    $ npm --version
    8.1.2

## Github

Install github in local system

      https://git-scm.com/downloads

      git clone https://gitlab.com/systango/arrowup/user-management.git

## Local setup
Step 1. Clone the application using git clone `https://gitlab.com/systango/arrowup/user-management.git`
Step 2. Run `npm install`
Step 3. Create `.env` file in the root directory and set the following environment variables in `.env` file :
```
NODE_ENV=

SERVER_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DIALECT=

# AWS
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
AWS_SIGNATURE=
S3_BUCKET=

# URLs
NOTIFICATION_URL=
SITE_LINK=

# CONSTANT
LINK_DURATION=
```

Step 4. Run `npm run grunt` to start the application locally

## Third Party Services Used
	
- AWS


## List of all the instances/url where deployed

DEVELOPMENT: https://mh3qi3fxbe.execute-api.us-east-1.amazonaws.com/dev/user-management/api/v1/
STAGING: https://31w9qqwi8h.execute-api.us-west-1.amazonaws.com/stage/user-management/api/v1/
