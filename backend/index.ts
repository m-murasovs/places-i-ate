import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

export const DISALLOWED_RESTAURANTS = [
    'Żabka | Prosto z pieca',
    'Shell',
    'McDonald\'s',
    'Subway',
    'Wild Bean Cafe',
    'KFC',
];

export const DATASET_URL = 'https://api.apify.com/v2/datasets/iPKiTWZqnGc3qS1y0/items?token=apify_api_qr4r0vaVreBfgDNNoGfbm3uCAdzAzl4zEBIA';

export interface Restaurant {
    searchString: string;
    rank: number;
    searchPageUrl: string;
    isAdvertisement: boolean;
    placeId: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    neighborhood: string;
    street: string;
    city: string;
    postalCode: string;
    state: string | null;
    countryCode: string;
    categoryName: string;
    categories: string[];
    title: string;
    totalScore: number;
    permanentlyClosed: boolean;
    temporarilyClosed: boolean;
    reviewsCount: number;
    url: string;
    price: string | null;
    cid: string;
    fid: string;
    imageUrl: string;
}

const schema = buildSchema(`#graphql
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
`);

const rootValue = {
    restaurants: () => {
        return [];
    },
};

const app = express();

app.use('/graphql',
    graphqlHTTP({
        schema,
        rootValue,
        graphiql: { headerEditorEnabled: true },
    }),
);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}/graphql`);
});
