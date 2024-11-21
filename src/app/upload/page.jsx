'use client';
import React from 'react';
import dataset from '../../../dataset.json';
// import { createNewRestaurant } from '@/Server/actions/RestaurantActions';
import { PrimaryButton } from '@/components/button';

// const DISALLOWED_RESTAURANTS = [
//     'Żabka | Prosto z pieca',
//     'Shell',
//     'McDonald\'s',
//     'Subway',
//     'Wild Bean Cafe',
//     'KFC',
// ];

const UploadPage = () => {
    const upload = async () => {
        // for (const restaurant of dataset) {
        //     if (!DISALLOWED_RESTAURANTS.includes(restaurant.title)) {
        //         const rest = await createNewRestaurant(restaurant);
        //         console.log(`Uploaded ${rest.title}`);
        //     }
        // }
    };

    console.log(dataset[0]);

    return <div>
        <h1>Upload</h1>
        <PrimaryButton onClick={() => upload()}>Upload</PrimaryButton>
    </div>;
};

export default UploadPage;
