import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";
import { fetch } from "cross-fetch";
import { typeDefs } from "./schema";

const app = express();
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
app.listen(4002, () =>
  console.log(`products running at http://localhost:4002/graphql`)
);

fetch("http://localhost:4500/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "prices",
    url: "http://localhost:4002/graphql",
    typeDefs,
  }),
});
