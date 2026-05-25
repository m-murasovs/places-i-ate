'use client';
import { fetchUserVisits } from '@/Server/actions/VisitActions';
import { RatingType, SortType } from '@/Server/VisitService/VisitService';
import { useQuery } from '@tanstack/react-query';

const useFetchVisitedPlaces = (limit: number = 50, offset: number = 0, rating?: RatingType, sort: SortType = 'date') => {
    return useQuery({
        queryKey: ['fetchVisitedPlaces', limit, offset, rating, sort],
        queryFn: () => fetchUserVisits(limit, offset, rating, sort),
        enabled: !!limit,
    });
};

export default useFetchVisitedPlaces;
