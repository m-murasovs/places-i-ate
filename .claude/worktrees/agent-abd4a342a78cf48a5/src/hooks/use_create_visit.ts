'use client';
import { createVisitWithPlace } from '@/Server/actions/VisitActions';
import { RatingType } from '@/Server/VisitService/VisitService';
import { useMutation } from '@tanstack/react-query';
import { invalidateQueries } from '@/app/react_query_provider';

const useCreateVisit = () => {
    return useMutation({
        mutationFn: (data: {
            placeId?: string;
            placeName: string;
            address: string;
            rating: RatingType;
            review?: string;
            visitDate: Date;
        }) => createVisitWithPlace(data),
        onSuccess: () => {
            invalidateQueries(['fetchVisitedPlaces']);
        },
    });
};

export default useCreateVisit;
