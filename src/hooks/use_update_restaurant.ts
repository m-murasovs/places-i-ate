import { updateRestaurant } from '@/Server/actions/RestaurantActions';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';
import { ItemId } from '@/Server/Service/types';
import { useMutation } from '@tanstack/react-query';
import { FindOptions } from 'mongodb';

const useUpdateRestaurant = () => {
    const mutation = useMutation(
        ({ _id, query }: { _id: ItemId; query: FindOptions<IRestaurant>; }) => {
            return updateRestaurant(_id, query);
        }
    );

    return mutation;
};

export default useUpdateRestaurant;
