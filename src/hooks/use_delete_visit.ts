'use client';
import { deleteVisit } from '@/Server/actions/VisitActions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeleteVisit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (visitId: string) => deleteVisit(visitId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchVisitedPlaces'] });
        },
    });
};

export default useDeleteVisit;
