'use client';
import { updateVisit } from '@/Server/actions/VisitActions';
import { RatingType } from '@/Server/VisitService/VisitService';
import { useMutation } from '@tanstack/react-query';
import { invalidateQueries } from '@/app/react_query_provider';

const useUpdateVisit = () => {
    return useMutation({
        mutationFn: ({ visitId, data }: {
            visitId: string;
            data: Partial<{
                rating: RatingType;
                review: string;
                visitDate: Date;
            }>;
        }) => updateVisit(visitId, data),
        onSuccess: () => {
            invalidateQueries(['fetchVisitedPlaces']);
        },
    });
};

export default useUpdateVisit;
