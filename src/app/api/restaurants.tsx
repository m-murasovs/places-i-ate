import RestaurantModel from '@/models/Restaurant';
import { NextApiRequest, NextApiResponse } from 'next';

const getRestaurants = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const restaurants = await RestaurantModel
            .find({})
            .limit(10);
        res.json(restaurants);
    } catch (e) {
        console.error(e);
    }
};

export default getRestaurants;
