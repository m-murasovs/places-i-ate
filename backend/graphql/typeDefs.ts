const typeDefs = `#graphql
    type Location {
        lat: Float
        lng: Float
    }

    input LocationInput {
        lat: Float!
        lng: Float!
    }

    type Restaurant {
        _id: ID
        searchString: String
        rank: Int
        searchPageUrl: String
        isAdvertisement: Boolean
        placeId: String
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
        totalScore: Float
        permanentlyClosed: Boolean
        temporarilyClosed: Boolean
        reviewsCount: Int
        url: String
        price: String
        cid: String
        fid: String
        imageUrl: String
        reviewStars: Int
        reviewText: String
    }

    type Query {
        getRestaurant(
            _id: ID
        ): Restaurant!
        getAllRestaurants(
            limit: Int
            offset: Int
        ): [Restaurant!]!
    }

    type Mutation {
        createRestaurant(
            _id: ID
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
            totalScore: Float
            permanentlyClosed: Boolean
            temporarilyClosed: Boolean
            reviewsCount: Int
            url: String
            price: String
            cid: String
            fid: String
            imageUrl: String
            reviewStars: Int
            reviewText: String
        ): Restaurant!,
        updateRestaurant(
            _id: ID
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
            totalScore: Float
            permanentlyClosed: Boolean
            temporarilyClosed: Boolean
            reviewsCount: Int
            url: String
            price: String
            cid: String
            fid: String
            imageUrl: String
            reviewStars: Int
            reviewText: String
        ): Restaurant!,
        deleteRestaurant(
            _id: ID
        ): Restaurant!
    }
`;

export default typeDefs;
