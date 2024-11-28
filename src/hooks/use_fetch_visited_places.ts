'use client';
import { fetchVisitedPlaces } from '@/Server/actions/PlaceActions';
import { useQuery } from '@tanstack/react-query';

const useFetchVisitedPlaces = (pageNumber: number, limit: number) => {
    return useQuery({
        queryKey: ['fetchVisitedPlaces', pageNumber],
        queryFn: () => fetchVisitedPlaces(pageNumber, limit),
        enabled: !!pageNumber && !!limit,
    });
};

export default useFetchVisitedPlaces;
