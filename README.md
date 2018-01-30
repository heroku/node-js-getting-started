# Code Louisvile JS API

This is my new text. It should create a conflict.

## Running Locally

### Requirements

* [Docker](https://www.docker.com/community-edition#/download)

### Running JS API

To run the JavaScript API, which is written using Node, and a Postgres database, you can do the following:

* Clone this repo
* From the repo directory on your machine, update the `database-schema` submodule with this command: `git submodule update --init`
* Build the Docker images: `docker-compose build`
* Start the database and Node server using Docker compose: `docker-compose up`

You should now be able to access the the JavaScript API's docs at [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs). If you're running Docker Toolbox on Windows (instead of Docker for Windows), which may be required if you use a Home edition of Windows, the address will be [http://192.168.99.100:8080/docs](http://192.168.99.100:8080/docs).

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
_made with the awesome [Monodraw](https://monodraw.helftone.com)_

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

## Developing the App

### Tools

##### Swagger

We are using [Swagger](https://swagger.io) to define and document our API.

We will define our REST endpoints in a Swagger YAML file, and then we will code corresponding endpoints in our Node Express application.

By using Swagger, we will be given a nice UI to test our endpoints and our clients (e.g. our front end Vue app) will be able to automatically generate clients to talk to our API.

To get started with Swagger:

* Install swagger: `npm install -g swagger`
  * If you don't have `npm` you can get it here: [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)
* From our project directory, start the Swagger editor: `swagger project edit`
  * This is where you'll make changes to our API spec
* Create endpoints corresponding to what you defined in Swagger

### Adding a REST Endpoint

#### Overview

To add a new RESTful endpoint, you will follow these steps:

1. Add endpoint to 	`/api/swagger/swagger.yaml`.
2. Add Javascript code corresponding to endpoing to controller JS file. If a controler for your endpoint doesn't exist, you'll add one. 

If database access is needed you'll do the following:

1. Create a model for the table you'll be using in `/models`.
2. Add an object to `db.js` corresponding to your model.
3. Import `db.js` into your controller using `require`.

#### Detailed step-by-step instructions

If you haven't already, fire up the app by running `docker-compose up`.
If you haven't done so in a while, it'd be good to make sure you're completely up-to-date:

* `git pull`
* `git submodule update` (add `--init` if you just cloned)
* `docker-compose down`
* `docker-compose build --no-cache`
* `docker-compose up`

You'll also be working on your own branch, which you'll push to `github` for review and merging, so go ahead and create that: `git checkout -b <branch name>`. Name you branch something like `username-feature` (e.g. `bretwalker-hello-post`)

###### Add endpoint to `/api/swagger/swagger.yaml`

The easiest and most foolproof way to edit `swagger.yaml` is by using the Swagger editor, and not by editing the file by hand. It helps you avoid mistakes by providing real-time validation of what you're changing. To start the swagger editor, run this command from the root project directory: `swagger project edit`. It should open your browser to the Swagger editor (or if not, it will at least give you a URL).

New endpoints should be added under the `paths` node. If you're adding an endpoint for a new HTTP verb (e.g. `GET`/`PUT`/`POST`/`DELETE`) for an existing URL, you'll find the corresponding URL and put a new verb under it. A great example of a full-featured API is available on the Swagger site: [https://editor.swagger.io](https://editor.swagger.io).

If I wanted to add a `POST` handler for `/hello` in our app, I would add something like this:

```
    post:
      description: Handles POST for /hello
      operationId: helloPost
      parameters:
        - name: body
          in: body
          description: The name of the person to whom to say hello
          schema:
            $ref: "#/definitions/Hello"
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/HelloWorldResponse"
        # responses may fall through to errors
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
```

This functions pretty much the same as our `GET` route, but it must be invoked via an HTTP `POST`.

Because your endpoint will need to return a custom JSON definition, you will probably need to define a new response schema (and possibly an error shema too). A schema is just a definition of what the response will look like. In the definition above, we're using `HelloWorldResponse` from the Swagger file's definition section. If you scroll down, you'll see it. It looks like this:

```
  HelloWorldResponse:
    required:
      - message
    properties:
      message:
        type: string
```

This corresponds to JSON that looks like this:

```
{"message":""}
```

We need to make sure our response matches this definition so that clients can properly handle the data we send back.

###### Add handler to controller

Because I'm adding a new verb handler for an endpoint that's already been configured, I won't need to create a new controller, since one's already set up. I can find the controller name by looking at `x-swagger-router-controller` in the Swagger definition. In this case, it's `helloWorld`, which means `/controllers/helloWorld.js` will be used to handle requests. If you're adding an endpoint for completely new functionality, you may need to create a new controller. The thing to keep in mind is that the Swagger definition is tied to your controller by the `x-swagger-router-controller` property.

Now I can add a new method in `hellowWorld.js` to handle the `POST` method. The method that's called is determined by the `operationId` in the Swagger definition. In our case, it's `helloPost`, so I need to add a method named `helloPost` to `helloWorld.js`.

```
function helloPost(req, res) {
  var name = req.swagger.params.body.value.name;
  var hello = util.format('Hello, %s!', name);

  res.json({'message': hello});
}
```

The last thing you need to do is to add your new function to the list of exported functions:

Add `helloPost: helloPost` to the `module.exports` object at the top of the file, or add a new `module.exports` object that dontains your method. Be sure the key matches the `operationId` from your Swagger definition.

**At this point, you should be able to open the Swagger UI and test your endpoint successfully!**

##### Database functionality

If you need to add database functionality to your endpoint, which you probably will, there are a couple more steps to follow.

###### Create a model

We are using [Sequelize](http://docs.sequelizejs.com) as or [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping), so we will define our model object using Sequelize classes and methods.

We should have one model for every table in our database. In some cases, there will be relationships between models.

Here is the model that corresponds to the `code_louisville_students` table:

```
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    return sequelize.define(
    	'code_louisville_students', 
    	{
    		id: {
    			type: Sequelize.BIGINT,
	    		primaryKey: true
   	 		},
	  		name: Sequelize.STRING
		}, {
			timestamps: false,
		})
};
```

There are a couple of things to note here:

* The first parameter passed to the `define` method is the name of the table. All of our tables are defined in `/database-schema/sql`.
* The fields of the table are defined in the second parameter passed to the `define` method as an object. Data types are listed in the [Sequelize documentation](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types).
* The third parameter passed to `define` is a configuration object. Configuration options are also available in the [Sequelize documentation](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#configuration).

###### Add to `db.js`

To make it easy to use our models, we expose them via a wrapper -- `db.js`. By wiring up all of our models in this file, we can simply include a single file in our controllers and access all of our models (and their underlying database tables) though the `db` object.

To add the model to `db.js`:
1. Import your model: `const CodeLouisvilleStudents = require('./models/codeLouisvilleStudents')`.
2. Create an instance of your model, passing it a Sequelize object: `var codeLouisvilleStudents = CodeLouisvilleStudents(sequelize)`.
3. Export your model. Add it to `module.exports`.

###### Import `db.js`

In your controller, import `db.js`: `var db = require('../db')`.

At this point, you can use the `db` object to interact with the database via your model!

For example:
```
  db.codeLouisvilleStudents
    .findOne({ where: {name: 'Code Louisville Student One'} })
    .then(s => {
      res.json(util.format('Found this student in DB: %s', s.name));
    })
```

Check out the Sequelize documentation on:

* [Querying](http://docs.sequelizejs.com/manual/tutorial/querying.html)
* [Creating/Updating/Deleting] (http://docs.sequelizejs.com/manual/tutorial/instances.html)

**At this point, you should have an endpoint that is working with the database!**









