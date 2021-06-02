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
  { id: '1', name: 'Red Book' },
  { id: '2', name: 'Green Book' },
  { id: '3', name: 'Blue Book' },
];

export default makeExecutableSchema({
  schemaTransforms: [stitchingDirectivesValidator],
  typeDefs,
  resolvers: {
    Query: {
      books: (_root, args) => books,
      book: (_root, { id }) => books.find((book) => book.id === id),
      _sdl: () => typeDefs,
    },
  },
});
