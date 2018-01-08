# Code Louisvile JS API


Right now, this is a barebones Node.js app using [Express 4](http://expressjs.com/), built from  [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

Over the course of the Winter 2018 session, this will become the JavaScript backend and frontend powering our fitness tracker site!

## Running Locally

### Requirements

* [Docker](https://www.docker.com/community-edition#/download)

### Running JS API

To run the JavaScript API, which is written using Node, and a Postgres database, you can do the following:

* Clone this repo
* From the repo directory on your machine, update the `database-schema` submodule with this command: `git submodule update --init`
* Start the database and Node server using Docker compose: `docker compose up`

You should now be able to access the the JavaScript API at [http://127.0.0.1:8080](http://127.0.0.1:8080). If you're running Docker Toolbox on Windows (instead of Docker for Windows), which may be required if you use a Home edition of Windows, the address will be [http://192.168.99.100:8080](http://192.168.99.100:8080).

### Local Architecture & Tools

Even if you're able to get the JS API up and running using the above commands, you may be wondering how it all works.

The first thing to understand is Docker. Docker is a technology that lets us build and run container images. Here's how Docker [describes](https://www.docker.com/what-container) a container images: 

> A container image is a lightweight, stand-alone, executable package of a piece of software that includes everything needed to run it: code, runtime, system tools, system libraries, settings.

Once we have a container configured, we can run instances of those images, which are simply referred to as containers. It's possible to run many versions of the same container image at once, which is particualrly useful if you're trying to build a scalabe web service. We don't need to do anything that fancy for this class, we just want to use containers to handle running and configuring a database along with our app.

With this app, we will run three containers:

* Node JS API
* Postgres database
* Flyway database migration tool

The first two will stay running until we stop them. The last container will run, check to make sure the database has all of the scripts in our `database-schema` folder run against it, and then exit.

```
┌────────────┐      ┌────────────┐
│            │      │            │
│            │      │            │
│  JS API    │─────▶│  Postgres  │
│            │      │     DB     │
│            │      │            │
└────────────┘      └────────────┘
                           ▲      
                           │      
                           │      
                    ┌ ─ ─ ─ ─ ─ ─ 
                                 │
                    │             
                        Flyway   │
                    │             
                                 │
                    └ ─ ─ ─ ─ ─ ─ 
```
_made with the awesome [Monodraw](https://monodraw.helftone.com)`

In order to run these containers and set up networking between them, we use another tool - Docker Compose. Docker Compose uses a configuration file that tells it what containers should be run together and how they should be allowed to communicate.

The command to start the containers is `docker-compose up`. After running this command, you'll see the three containers start up. You'll see the logs for each conainer.

**All `docker` and `docker-compose` commands should be run from the `javascript-api` folder, the one with the `Dockerfile` and `docker-compose.yaml` files in it.**

The Flyway container is set to start up a few seconds after the other two, since it needs to connect to the database to run SQL scripts to create tables.

To stop the containers, you can stop the command execution by pressing `Ctrl+C`.

Another option when running the containers is to run `docker-compose up -d`, which will run the containers in "detached" mode, which means they run in the background. You can check their logs by using command line commands or an app like [Kitematic](https://kitematic.com). If you run the containers in detached mode, you can stop them by running `docker-compose down`.

By default, our Docker Compose configuration will perserve the data in the SQL database between Docker Compose. If you would like to delete the database data, you can run `docker-compose down --volumes`.

##### Docker Image Updates

Any time we add any new `npm` modules, you will need to update your `javascript-api` Docker image. To do this, simply run `docker-compose build` before running `docker-compose up`. This command will create a new image that has all of the current `npm` modules installed in it.

### Flyway and Database Migrations

As mentioned above, the database's schema is managed by a tool called [Flyway](https://flywaydb.org). Because we have two different projects written in two different languages working against the same database, we wanted to find a way to manage the database schema (that is, it's tables, indexes, relationships, etc.) in a language- and project-agnostic way.

To that end, we're using Flyway, which we've configured to automatically read from our [`database-schema`](https://github.com/codelouisvilleproject/database-schema) repo. 

If you look in the `sql` directory of the `database-schema` project, you'll see all of the database migrations. Migrations are just SQL scripts that should be applied in order. The naming of the migrations specifies the order in which they are applied. The prefix of the file names starts with `V#`, where `#` is the version number.

Take a look at the files; you'll see standard SQL just like you learned about in Treehouse.

The `database-schema` repo is linked to the `javascript-api` repo as a git submodule. All you need to know about a submodule is that it allows one git repository to be included in another. This is how we include `database-schema` in both the `javascript-api` and `dotnet-project` projects. The one thing you need to know about submodules is that to get the latest version, you need to run `git submodule update --remote` from the `javascript-api` directory. If we, as a team, ever modify the database schema, you'll need to run this command before running `docker-compose up` so that Flyway has the latest version of the migration scripts to apply.
