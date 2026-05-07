'use client';
import { fetchUserVisits } from '@/Server/actions/VisitActions';
import { useQuery } from '@tanstack/react-query';

const useFetchVisitedPlaces = (limit: number = 50, offset: number = 0) => {
    return useQuery({
        queryKey: ['fetchVisitedPlaces', offset],
        queryFn: () => fetchUserVisits(limit, offset),
        enabled: !!limit,
    });
};

export default useFetchVisitedPlaces;
