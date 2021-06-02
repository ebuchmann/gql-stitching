import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import * as fs from 'fs';
import * as path from 'path';

const { stitchingDirectivesTypeDefs, stitchingDirectivesValidator } = stitchingDirectives();

export const typeDefs = `
  ${stitchingDirectivesTypeDefs}
  ${fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')}
`;

const reviews = [
  { id: '1', bookId: '1', name: 'Bober', rating: 5 },
  { id: '2', bookId: '2', name: 'Dole', rating: 3 },
  { id: '3', bookId: '1', name: 'George', rating: 4 },
];

export default makeExecutableSchema({
  schemaTransforms: [stitchingDirectivesValidator],
  typeDefs,
  resolvers: {
    Query: {
      reviews: (_root, { id }) => reviews.filter((review) => review.bookId === id),
      _book: (_root, book) => ({
        ...book,
        reviews: reviews.filter((review) => review.bookId === book.id),
      }),
      _sdl: () => typeDefs,
    },
  },
});
