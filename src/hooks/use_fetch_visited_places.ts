'use client';
import { fetchUserVisits } from '@/Server/actions/VisitActions';
import { RatingType } from '@/Server/VisitService/VisitService';
import { useQuery } from '@tanstack/react-query';

const useFetchVisitedPlaces = (limit: number = 50, offset: number = 0, rating?: RatingType) => {
    return useQuery({
        queryKey: ['fetchVisitedPlaces', offset, rating],
        queryFn: () => fetchUserVisits(limit, offset, rating),
        enabled: !!limit,
    });
};

export default useFetchVisitedPlaces;
