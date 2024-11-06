'use client';
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ALL_RESTAURANTS = gql`
    query GetAllRestaurants {
        getAllRestaurants {
            title
            _id
        }
    }
`;

export default function Home() {
    const { loading, error, data } = useQuery(GET_ALL_RESTAURANTS);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error {error.message}</div>;

    console.log(data);
    return (
        <div>
            <button style={{ border: 'solid 1px black' }}>Press me</button>
        </div>
    );
}
