import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// For some reason, this is a default export even though it's not default in the file. Also, I have to import it from .js because that's what it is after compiling.
import restaurants from './dataset.js';

const typeDefs = `#graphql
    type Location {
        lat: Int
        lng: Int
    }

    type Restaurant {
        searchString: String
        rank: Int
        searchPageUrl: String
        isAdvertisement: Boolean
        placeId: String
        location: Location
        address: String
        neighborhood: String
        street: String
        city: String
        postalCode: String
        state: String
        countryCode: String
        categoryName: String
        categories: [String]
        title: String!
        totalScore: Int
        permanentlyClosed: Boolean
        temporarilyClosed: Boolean
        reviewsCount: Int
        url: String
        price: String
        cid: String
        fid: String
        imageUrl: String
    }

    type Query {
        restaurants: [Restaurant!]!
    }
`;

console.log(Array.isArray(restaurants));

const resolvers = {
    Query: {
        restaurants: () => restaurants,
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
