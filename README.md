# GraphQL Schema Stitching Gateway Example

This project is meant to show how newer versions of schema stitching for GraphQL can be used to create a federated GraphQL gateway. The work here is based off examples from the [Schema Stitching Handbook](https://github.com/gmac/schema-stitching-handbook) and meant to work more like Apollo Federation would set up the architecture.

## Getting started

Clone and install dependencies, and then start running different services:

1. `yarn start-registry` will start the registry
2. `yarn start-services` will start two of the services
3. `yarn start-gateway` will start up the gateway

You can then visit the [GQL playground](http://localhost:4000/playground) and see the graph.

This example uses hot reloading so the gateway doesn't have to be restarted if any schemas change, to see this in action run `yarn start-reviews` to start the third service and notice how the Gateway will continue checking with the registry, and if there are changes it will update automatically and the playground will update with the new Review schema.

## The services

There are a few different parts all working together here.

### Registry

The purpose of the registry is to store the schemas and information about connecting to the services, ideally in a more resiliant location such as S3 or a database. For the purposes of this demo it will create a file in the registry/schemas folder based on the service name.

The registry exposes a few endpoints:

POST `/register` - This will take the data from a service and generate a file for it
GET `/schemas/:hash` - This will return the schema data if the hash doesn't match the current hash. Otherwise it will return 304 saying the data hasn't changed.

### Gateway

The purpose of the gateway is to combine the schemas from all the services in the registry and "stitch" them together as a single endpoint. It will delegate requests to the different services and return the data.

### Services

These would generally be your micro services.
