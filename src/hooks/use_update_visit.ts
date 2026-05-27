'use client';
import { updateVisit } from '@/Server/actions/VisitActions';
import { RatingType } from '@/Server/VisitService/VisitService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdateVisit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ visitId, data }: {
            visitId: string;
            data: Partial<{
                rating: RatingType;
                review: string;
                visitDate: Date;
                visitedWithUserIds: string[];
            }>;
        }) => updateVisit(visitId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchVisitedPlaces'] });
        },
    });
};

export default useUpdateVisit;
