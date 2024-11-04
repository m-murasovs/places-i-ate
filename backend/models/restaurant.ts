import { Schema, model } from 'mongoose';
import type { Restaurant } from 'types';

const restaurantSchema = new Schema<Restaurant>({
    _id: {
        type: String,
        required: false,
    },
    searchString: {
        type: String,
        allowNull: false,
    },
    rank: {
        type: Number,
        allowNull: false,
    },
    searchPageUrl: {
        type: String,
        allowNull: false,
    },
    isAdvertisement: {
        type: Boolean,
        allowNull: false,
    },
    placeId: {
        type: String,
        allowNull: false,
    },
    location: {
        type: {
            lat: Number,
            lng: Number,
        },
        allowNull: false,
    },
    address: {
        type: String,
        allowNull: false,
    },
    neighborhood: {
        type: String,
        allowNull: false,
    },
    street: {
        type: String,
        allowNull: false,
    },
    city: {
        type: String,
        allowNull: false,
    },
    postalCode: {
        type: String,
        allowNull: false,
    },
    state: {
        type: String,
        allowNull: true,
    },
    countryCode: {
        type: String,
        allowNull: false,
    },
    categoryName: {
        type: String,
        allowNull: false,
    },
    categories: {
        type: [String],
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    totalScore: {
        type: Number,
        required: false,
    },
    permanentlyClosed: {
        type: Boolean,
        required: false,
    },
    temporarilyClosed: {
        type: Boolean,
        required: false,
    },
    reviewsCount: {
        type: Number,
        required: false,
    },
    url: {
        type: String,
        required: false,
    },
    price: {
        type: String,
        required: false,
    },
    cid: {
        type: String,
        required: false,
    },
    fid: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false,
    },
});

const RestaurantModel = model<Restaurant>('Restaurant', restaurantSchema);

export default RestaurantModel;
