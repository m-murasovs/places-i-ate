import { gql } from 'apollo-server';

const typeDefs = gql`
    type Location {
        lat: Int
        lng: Int
    }

    input LocationInput {
        lat: Float!
        lng: Float!
    }

    type Restaurant {
        id: ID!
        searchString: String
        rank: Int
        searchPageUrl: String
        isAdvertisement: Boolean
        placeId: String
        # The location should be an object containing the lat and lng fields
        location: Location!
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
        getRestaurant: Restaurant!
        getAllRestaurants: [Restaurant!]!
    }

    type Mutation {
        createRestaurant(
            id: ID!
            searchString: String
            rank: Int
            searchPageUrl: String
            isAdvertisement: Boolean
            placeId: String
            location: LocationInput!
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
        ): Restaurant!,
        updateRestaurant(
            id: ID!
            searchString: String
            rank: Int
            searchPageUrl: String
            isAdvertisement: Boolean
            placeId: String
            location: LocationInput!
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
        ): Restaurant!,
        deleteRestaurant(
            id: ID!
        ): Restaurant!
    }
`;

export default typeDefs;
