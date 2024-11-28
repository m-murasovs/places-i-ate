'use client';
import React from 'react';
import dataset from '../../../dataset.json';
// import { createNewPlace } from '@/Server/actions/PlaceActions';
import { PrimaryButton } from '@/components/button';

// const DISALLOWED_PLACES = [
//     'Żabka | Prosto z pieca',
//     'Shell',
//     'McDonald\'s',
//     'Subway',
//     'Wild Bean Cafe',
//     'KFC',
// ];

const UploadPage = () => {
    const upload = async () => {
        // for (const place of dataset) {
        //     if (!DISALLOWED_PLACES.includes(place.title)) {
        //         const rest = await createNewPlace(place);
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
