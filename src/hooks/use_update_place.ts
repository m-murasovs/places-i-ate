import { updatePlace } from '@/Server/actions/PlaceActions';
import { IPlace } from '@/Server/Service/PlaceService/IPlaceService';
import { ItemId } from '@/Server/Service/types';
import { useMutation } from '@tanstack/react-query';
import { FindOptions } from 'mongodb';

const useUpdatePlace = () => {
    const mutation = useMutation(
        ({ _id, query }: { _id: ItemId; query: FindOptions<IPlace>; }) => {
            return updatePlace(_id, query);
        }
    );

    return mutation;
};

export default useUpdatePlace;
