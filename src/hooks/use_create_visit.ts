'use client';
import { createVisitWithPlace } from '@/Server/actions/VisitActions';
import { RatingType } from '@/Server/VisitService/VisitService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateVisit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            placeId?: string;
            placeName: string;
            address: string;
            rating: RatingType;
            review?: string;
            visitDate: Date;
            visitedWithUserIds?: string[];
        }) => createVisitWithPlace(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchVisitedPlaces'] });
        },
    });
};

export default useCreateVisit;
