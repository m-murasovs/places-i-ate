'use client';
import { searchRestaurants } from '@/Server/actions/RestaurantActions';
import { useQuery } from '@tanstack/react-query';

const useSearchRestaurants = (query: string) => {
    return useQuery({
        queryKey: ['searchRestaurants', query],
        queryFn: () => searchRestaurants(query),
        enabled: !!query,
    });
};

export default useSearchRestaurants;
