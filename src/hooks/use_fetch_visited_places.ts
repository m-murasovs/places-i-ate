'use client';
import { fetchVisitedRestaurants } from '@/Server/actions/RestaurantActions';
import { useQuery } from '@tanstack/react-query';

const useFetchVisitedPlaces = (pageNumber: number, limit: number) => {
    return useQuery({
        queryKey: ['fetchVisitedPlaces', pageNumber],
        queryFn: () => fetchVisitedRestaurants(pageNumber, limit),
        enabled: !!pageNumber && !!limit,
    });
};

export default useFetchVisitedPlaces;
