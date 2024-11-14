const typeDefs = `#graphql
    scalar Date

    type User {
        _id: ID
        email: String
        password: String
        name: String
        phone: String
        image: String
        createdAt: Date
        updatedAt: Date
    }

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
        getUser(
            _id: ID
        ): User!
        getRestaurant(
            _id: ID
        ): Restaurant!
        getAllRestaurants(
            limit: Int
            offset: Int
        ): [Restaurant!]!
    }

    type Mutation {
        createUser(
            _id: ID
            email: String!
            password: String!
            name: String!
            phone: String
            image: String
        ): User!,
        updateUser(
            _id: ID
            email: String
            password: String
            name: String
            phone: String
            image: String
        ): User!,
        deleteUser(
            _id: ID
        ): User!,
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
