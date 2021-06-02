import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import * as fs from 'fs';
import * as path from 'path';

const { stitchingDirectivesTypeDefs, stitchingDirectivesValidator } = stitchingDirectives();

export const typeDefs = `
  ${stitchingDirectivesTypeDefs}
  ${fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')}
`;

const books = [
  { id: '1', price: 899, color: 'red' },
  { id: '2', price: 1299, color: 'green' },
  { id: '3', price: 54, color: 'blue' },
];

export default makeExecutableSchema({
  schemaTransforms: [stitchingDirectivesValidator],
  typeDefs,
  resolvers: {
    Book: {
      price: (book) => book.price,
    },
    Query: {
      _book: (_root, { id }) => books.find((book) => book.id === id),
      _sdl: () => typeDefs,
    },
  },
});
