import { DataTypes } from 'sequelize';
import db from '../utils/db';

const Restaurant = db.define('Restaurant', {
    searchString: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    searchPageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdvertisement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    placeId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permanentlyClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    temporarilyClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    reviewsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Restaurant;
