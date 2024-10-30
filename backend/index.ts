import { ApolloServer } from 'apollo-server';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import db from './utils/db';

export const DISALLOWED_RESTAURANTS = [
    'Żabka | Prosto z pieca',
    'Shell',
    'McDonald\'s',
    'Subway',
    'Wild Bean Cafe',
    'KFC',
];

export const DATASET_URL = 'https://api.apify.com/v2/datasets/iPKiTWZqnGc3qS1y0/items?token=apify_api_qr4r0vaVreBfgDNNoGfbm3uCAdzAzl4zEBIA';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, db }),
});

server.listen({ port: process.env.PORT || 8080 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
