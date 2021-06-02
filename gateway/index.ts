import waitOn from 'wait-on';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import schemaLoader from './SchemaLoader';

function makeServer(schema, name, port = 4000) {
  const app = express();
  app.use(
    '/graphql',
    graphqlHTTP(() => ({ schema: schemaLoader.schema })),
  );
  app.get(
    '/playground',
    expressPlayground({
      endpoint: '/graphql/</script><script>alert(1)</script><script>',
    }),
  );
  app.listen(port, () => console.log(`${name} running at http://localhost:${port}/graphql`));
}

waitOn({ resources: [4001, 4002].map((p) => `tcp:${p}`) }, async () => {
  makeServer(schemaLoader.schema, 'gateway', 4000);
});
