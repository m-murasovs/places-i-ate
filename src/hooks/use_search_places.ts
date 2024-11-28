'use client';
import { searchPlaces } from '@/Server/actions/PlaceActions';
import { useQuery } from '@tanstack/react-query';

const useSearchPlaces = (query: string) => {
    return useQuery({
        queryKey: ['searchPlaces', query],
        queryFn: () => searchPlaces(query),
        enabled: !!query,
    });
};

export default useSearchPlaces;
