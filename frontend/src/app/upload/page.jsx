'use client';
import React from 'react';
import { useMutation, gql } from '@apollo/client';
import dataset from '../../../../dataset.json';

const DISALLOWED_RESTAURANTS = [
    'Żabka | Prosto z pieca',
    'Shell',
    'McDonald\'s',
    'Subway',
    'Wild Bean Cafe',
    'KFC',
];

const CREATE_RESTAURANT = gql`
    mutation CreateRestaurant($location: LocationInput!, $title: String!, $id: ID, $searchString: String, $rank: Int, $searchPageUrl: String, $isAdvertisement: Boolean, $placeId: String, $address: String, $neighborhood: String, $street: String, $city: String, $postalCode: String, $state: String, $countryCode: String, $categoryName: String, $categories: [String], $totalScore: Float, $permanentlyClosed: Boolean, $temporarilyClosed: Boolean, $reviewsCount: Int, $url: String, $price: String, $cid: String, $fid: String, $imageUrl: String) {
    createRestaurant(location: $location, title: $title, _id: $id, searchString: $searchString, rank: $rank, searchPageUrl: $searchPageUrl, isAdvertisement: $isAdvertisement, placeId: $placeId, address: $address, neighborhood: $neighborhood, street: $street, city: $city, postalCode: $postalCode, state: $state, countryCode: $countryCode, categoryName: $categoryName, categories: $categories, totalScore: $totalScore, permanentlyClosed: $permanentlyClosed, temporarilyClosed: $temporarilyClosed, reviewsCount: $reviewsCount, url: $url, price: $price, cid: $cid, fid: $fid, imageUrl: $imageUrl) {
        _id
        searchString
        rank
        searchPageUrl
        isAdvertisement
        placeId
        location {
            lat
            lng
        }
        address
        neighborhood
        street
        city
        postalCode
        state
        countryCode
        categoryName
        categories
        title
        totalScore
        permanentlyClosed
        temporarilyClosed
        reviewsCount
        url
        price
        cid
        fid
        imageUrl
    }
}`;

const UploadPage = () => {
    const [createRestaurantFn, { data, loading, error }] = useMutation(CREATE_RESTAURANT);

    const addData = () => {
        dataset.forEach((restaurant) => {
            if (DISALLOWED_RESTAURANTS.includes(restaurant.title)) return;

            createRestaurantFn({
                variables: {
                    location: {
                        lat: restaurant.location.lat,
                        lng: restaurant.location.lng
                    },
                    title: restaurant.title,
                    searchString: restaurant.searchString,
                    rank: restaurant.rank,
                    searchPageUrl: restaurant.searchPageUrl,
                    isAdvertisement: restaurant.isAdvertisement,
                    placeId: restaurant.placeId,
                    address: restaurant.address,
                    neighborhood: restaurant.neighborhood,
                    street: restaurant.street,
                    city: restaurant.city,
                    postalCode: restaurant.postalCode,
                    state: restaurant.state,
                    countryCode: restaurant.countryCode,
                    categoryName: restaurant.categoryName,
                    categories: restaurant.categories,
                    totalScore: restaurant.totalScore,
                    permanentlyClosed: restaurant.permanentlyClosed,
                    temporarilyClosed: restaurant.temporarilyClosed,
                    reviewsCount: restaurant.reviewsCount,
                    url: restaurant.url,
                    price: restaurant.price,
                    cid: restaurant.cid,
                    fid: restaurant.fid,
                    imageUrl: restaurant.imageUrl
                }
            });
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log(data);

    return <div>
        <h1>Upload</h1>
        <button onClick={addData}>Add data</button>
    </div>;
};

export default UploadPage;
