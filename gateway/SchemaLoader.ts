import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { buildSchema } from 'graphql';
import { fetch } from 'cross-fetch';
import { print } from 'graphql';

const { stitchingDirectivesTransformer } = stitchingDirectives();

class SchemaLoader {
  schema;
  currentHash: string = null;
  intervalId: NodeJS.Timeout = null;

  constructor() {
    this.getRemoteSchemas();
    this.autoRefresh();
  }

  makeRemoteExecutor(url: string) {
    return async ({ document, variables }) => {
      const query = typeof document === 'string' ? document : print(document);
      const fetchResult = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      return fetchResult.json();
    };
  }

  async getRemoteSchemas() {
    const response = await fetch(`http://localhost:4500/schemas/${this.currentHash}`);
    if (response.status === 200) {
      const { hash, data } = await response.json();
      this.currentHash = hash;
      this.makeGatewaySchema(data);
    }
  }

  makeGatewaySchema(schemas) {
    console.log('Making new');
    this.schema = stitchSchemas({
      subschemaConfigTransforms: [stitchingDirectivesTransformer],
      subschemas: schemas.map(({ typeDefs, url }) => ({
        schema: buildSchema(typeDefs),
        executor: this.makeRemoteExecutor(url),
      })),
    });
  }

  autoRefresh(interval = 15000) {
    console.log('Checking');
    this.stopAutoRefresh();
    this.intervalId = setTimeout(async () => {
      await this.getRemoteSchemas();
      this.intervalId = null;
      this.autoRefresh(interval);
    }, interval);
  }

  stopAutoRefresh() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default new SchemaLoader();
