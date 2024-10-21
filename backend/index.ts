import express, { Request, Response, NextFunction } from 'express';
import { DiagnosticCategory } from 'typescript';
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 5000;

export type Restaurant = {
    searchString: string;
    rank: number;
    searchPageUrl: string;
    isAdvertisement: boolean;
    placeId: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    neighborhood: string;
    street: string;
    city: string;
    postalCode: string;
    state: string | null;
    countryCode: string;
    categoryName: string;
    categories: string[];
    title: string;
    totalScore: number;
    permanentlyClosed: boolean;
    temporarilyClosed: boolean;
    reviewsCount: number;
    url: string;
    price: string | null;
    cid: string;
    fid: string;
    imageUrl: string;
};

const DISALLOWED_RESTAURANTS = [
    'Żabka | Prosto z pieca',
    'Shell',
    "McDonald's",
    'Subway',
    'Wild Bean Cafe',
    'KFC'
];
const DATASET_URL = 'https://api.apify.com/v2/datasets/iPKiTWZqnGc3qS1y0/items?token=apify_api_qr4r0vaVreBfgDNNoGfbm3uCAdzAzl4zEBIA';

router.use((req: Request, res: Response, next: NextFunction) => {
    next();
});

router.get('/', async (req: Request, res: Response) => {
    const response = await fetch(DATASET_URL);

    const data = await response.json();
    const cleanedRestaurants = data.filter((restaurant: Restaurant) => {
        if (!DISALLOWED_RESTAURANTS.includes(restaurant.title)) return restaurant;
    });

    res.send(cleanedRestaurants);
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

