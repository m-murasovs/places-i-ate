'use client';
import dynamic from 'next/dynamic';
import useFetchVisitedPlaces from '@/hooks/use_fetch_visited_places';
import { VisitWithPlace } from '@/Server/VisitService/VisitService';

const VisitMap = dynamic(() => import('@/components/VisitMap'), {
    ssr: false,
    loading: () => <p>Loading map component...</p>,
});

export default function MapPage() {
    const { data, isLoading, isError, error } = useFetchVisitedPlaces(200, 0);

    if (isLoading) return <p>Loading visits...</p>;
    if (isError) return <p className='text-red-600'>Error: {(error as Error)?.message}</p>;

    return (
        <div>
            <h2 className='text-2xl mb-4'>My visits map</h2>
            <p className='text-sm text-gray-500 mb-2'>{data?.visits?.length ?? 0} visits loaded</p>
            <VisitMap visits={(data?.visits ?? []) as VisitWithPlace[]} />
        </div>
    );
}
