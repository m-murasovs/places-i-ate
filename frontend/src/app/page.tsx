'use client';
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Restaurant } from '@/types';

const GET_ALL_RESTAURANTS = gql`
    query GetAllRestaurants {
        getAllRestaurants(limit: 10, offset: 0) {
            title
            _id
        }
    }
`;

export default function Home() {
    const { loading, error, data } = useQuery(GET_ALL_RESTAURANTS);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error {error.message}</div>;

    return (
        <div>
            <h1>Restaurants</h1>
            <br />
            <ul>
                {data.getAllRestaurants.map((restaurant: Partial<Restaurant>) => (
                    <li key={restaurant._id}>{restaurant.title}</li>
                ))}
            </ul>
        </div>
    );
}
