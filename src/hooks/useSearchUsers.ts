'use client';
import { searchUsers } from '@/Server/actions/UserActions';
import { useQuery } from '@tanstack/react-query';

const useSearchUsers = (query: string) => {
    return useQuery({
        queryKey: ['searchUsers', query],
        queryFn: () => searchUsers(query),
        enabled: query.length >= 2,
    });
};

export default useSearchUsers;
