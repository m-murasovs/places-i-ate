import useSearchPlaces from '@/hooks/use_search_places';
import { Place } from '@prisma/client';

const FoundPlaces = ({ searchInput }: { searchInput: string; }) => {
    const { data: foundPlaces, isLoading, isFetching, isError } = useSearchPlaces(searchInput);
    const placeNotFound = (!searchInput.length && !foundPlaces && !isFetching) || isError;

    if (!searchInput.length) return;
    if (isLoading || isFetching) return <p>Loading...</p>;
    if (placeNotFound) return <p>
        Nothing found for <b>{searchInput}</b>. I guess you should add it?
    </p>;

    return foundPlaces?.map((place: Place) => {
        if (!place) return;

        return <div key={place.id} className='my-6'>
            <h3 className='font-semibold'>{place.name}</h3>
            <p className='text-gray-600'>{place.address}</p>
        </div>;
    });
};

export default FoundPlaces;
