# Table of Contents
- [Table of Contents](#table-of-contents)
  - [Architecture](#architecture)
  - [Requirements](#requirements)
  - [Project Structure](#project-structure)
      - [Root dir](#root-dir)
      - [src](#src)
  - [Features](#features)
      - [Database](#database)
      - [Database Migration](#database-migration)
      - [Generic CRUDs](#generic-cruds)
        - [Validation](#validation)
        - [Pagination](#pagination)
        - [Sorting](#sorting)
      - [Generic Error handling](#generic-error-handling)
      - [Hooks](#hooks)
      - [Logging](#logging)
      - [Tests](#tests)
  - [Getting started](#getting-started)
  - [Building](#building)
  - [TODO List](#todo-list)
  - [Issues/New features](#issuesnew-features)

## Architecture
Boilerplate setup with:
 - Express
 - Typescript
 - TypeORM

 This boilerplate is configured in a 3 tier architecture:<br />
 ![CB Versions Dropdown](server-architecture.png)

**Route** tier takes care of:
- Redirecting incoming requests to the expected controller
- Handling responses

**Controller** tier takes care of:
- Applying bussiness rules

**Repository** tier takes care of:
- Acessing database

**Service** tier is meant to be used whenever a code must be used for both controller and scripts.


## Requirements
 - Node 14.1.0 or higher
 - Docker
  
## Project Structure

#### Root dir

| Name           | Description   |
|----------------|---------------|
| /data          | MySQL data    |
| /dist          | Server built  |
| /logs          | Server logs   |
| /node_modules  | Dependencies  |
| /src           | Server source |
| /test          | Tests         |

#### src

| Name                | Description   |
|---------------------|---------------|
| /config             | Server config files such as Log and Database configurations |
| /controller         | Controller tier |
| /entity             | Database entities definition |
| /enum               | Server enums |
| /errors             | Custom server errors |
| /initializer        | Initializer that must run when server is being initialized |
| /interface          | Server interfaces |
| /migration          | Database migration files |
| /repository*        | Repository tier |
| /route              | Route tier|
| /service            | Service tier used for sharing functions that are going to be used by the server and scripts|
| /type               | Server types |

*Repository tier is not being used in this boilerplate since TypeORM offers a great repository tier.

## Features

#### Database
There are 2 MySQL docker instance configure on docker-compose.yaml:
 - mysql: used for development.
 - mysql-test: used for running tests.
Database data is being stored under $ROOT_DIR/data/

You can drop your schema by running:
    npm run db:drop

You can reset your database by running:


#### Database Migration
Database migrations are located under /src/migration.

For applying all migrations into your current database, run:
    npm run migration:apply
For reverting, run:
    npm run migration:revert

#### Generic CRUDs
This project enables out-of-the-box CRUDS.
This is possible due to AbstractController and AbstractRoute.
If you do not need this functionality or do not want to use it, you can remove these files.

In order to create a new CRUD you must do the following:

1. Create your new entity (under /src/entity/)
   1. Add annotations for both TypeORM and class-validator.
2. Create a new Response Type (under /src/type/response/entity/)
3. Create a new controller (under /src/entity/)
   1. This controller must extend AbstractController
   2. You must provide your new entity/response type to AbstractController
   3. Implement responseParser.
   4. Check ProjectController for more details
4. Create a new route (under /src/route)
   1. This route must extend AbstractRoute
   2. You must provide your new entity/response type/controller to AbstractRoute

CRUD will create the following endpoints: (i.e. New Route file name = UserRoute.tsx)

| Method               | Endpoint  |
|----------------------|---------------|
|GET | /api/UserRoute/:id |
|POST | /api/UserRoute/:id |
|PATCH | /api/UserRoute/:id |
|DELETE | /api/UserRoute/:id |
| GET | /api/UserRoute/ *** |

***This endpoint has sort and pagination enabled.

##### Custom Route Name
If you want your route to have a custom name instead of the file name, you may use the ```CustomRouteName``` decorator.

Example: 
```typescript
@CustomRouteName("customName")
class CustomRoute extends AbstractRoute<
    Project,    
    ProjectResponseType,
    ProjectController
> {
    constructor() {
        super(ProjectController);
    }
}
```
Then your endpoints will look like:

| Method               | Endpoint  |
|----------------------|---------------|
|GET | /api/customName/:id |
|POST | /api/customName/:id |
|PATCH | /api/customName/:id |
|DELETE | /api/customName/:id |
| GET | /api/customName/ |


##### Validation
Whenever server could not find an element with the provided id an error **404** will be returned.

PATCH and POST will apply validation before trying to insert/update items on database.
You can specify the validation that is going to be applied by adding class-validator annotations into entity objects.
Whenever this validation fails, an error **400** wil be returned with information about invalid fields.

##### Pagination
In order to paginate a CRUD endpoint you have to provide 2 parameters: **pageSize** and **page**.

| Parameter            | Description   |
|----------------------|---------------|
| pageSize             | is the number of elements the request should return. |
| page                 |  is the page number you want to return |

Example:
Let's suposse we've 50 users

| Name                 | Description   |
|----------------------|---------------|
| Users (0 - 10)       | /api/UserRoute?pageSize=10&page=0 |
| Users (11 - 20)      | /api/UserRoute?pageSize=10&page=1 |
| Users (21 - 30)      | /api/UserRoute?pageSize=10&page=2 |
| Users (31 - 40)      | /api/UserRoute?pageSize=10&page=3 |
| Users (41 - 50)      | /api/UserRoute?pageSize=10&page=4 |

Whenever pageSize, page or both parameters are missing, all* records will be returned.<br/>
*Due to performance concerns server will not return more than 1000 records.

##### Sorting
In order to paginate a CRUD endpoint you have to provide **sort** parameter.<br/>
You can perform multiple sorting by using commas.<br/>
You can perform DESC sort by adding (-) in front of the parameter.

Example:

    /api/UserRoute?sort=-endDate,name

Whenever the sort parameter contains an invalid field, an error **500** will be returned informing an invalid sort value was found.

#### Generic Error handling
Generic error handling is configured under RoutesInitializer.
Any exepction thrown within an express route will be captured and handled gracefully.

#### Hooks
Pre-commit hook is configured with Prettier and Linter.

#### Logging
Logs are being printed in both file and console.
Morgan middleware is being used for printing all incoming requests and its status.
Winston is being used for custom log messages.
Winston is configured with rotation so that logs can be separated on a daily basis.
Log files are being generated under $ROOT_DIR/logs/

#### Tests
Tests are setup with Jest and Supertest.
Test files are being stored under $ROOT_DIR/test/

For running all tests:

    npm run test

## Getting started

1- Clone repository

    git clone https://github.pie.apple.com/venturus/ts-node-base.git
    cd ts-node-base

2- Install dependencies

    npm install

3- Start docker containers

    docker-compose up -d

4- Reset database

    npm run db:reset

5- Start dev server

    npm run start:dev

## Building

You can build the project by running:

    npm run build

Compiled code will be available under $ROOT_DIR/dist/

You can also start the production version by running:

    npm run start:prod

## TODO List
Add filtering for CRUDs

## Issues/New features
You can report issues or request new features through github Issues tab.

Feel free to contribute with new features and bug fixing.