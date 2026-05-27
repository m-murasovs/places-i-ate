'use client';
import { deleteVisit } from '@/Server/actions/VisitActions';
import { useMutation } from '@tanstack/react-query';
import { invalidateQueries } from '@/app/react_query_provider';

const useDeleteVisit = () => {
    return useMutation({
        mutationFn: (visitId: string) => deleteVisit(visitId),
        onSuccess: () => {
            invalidateQueries(['fetchVisitedPlaces']);
        },
    });
};

export default useDeleteVisit;
