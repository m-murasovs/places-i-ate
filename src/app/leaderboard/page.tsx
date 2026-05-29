import { getNetworkLeaderboard } from '@/Server/actions/PlaceActions';
import Link from 'next/link';

export default async function LeaderboardPage() {
    const entries = await getNetworkLeaderboard();

    return (
        <div className='max-w-2xl mx-auto'>
            <h1 className='text-2xl font-bold text-stone-900 mb-2'>Top rated</h1>
            <p className='text-stone-500 mb-6'>Best places across you and the people you follow.</p>

            {entries.length > 0 ? (
                <ol className='space-y-2'>
                    {entries.map((entry, i) => (
                        <li key={entry.place.id}>
                            <Link
                                href={`/place/${entry.place.id}`}
                                className='flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow'
                            >
                                <span className='text-lg font-bold text-stone-400 w-6 text-center'>{i + 1}</span>
                                <div className='min-w-0 flex-1'>
                                    <p className='font-medium text-stone-900 truncate'>{entry.place.name}</p>
                                    <p className='text-sm text-stone-500 truncate'>{entry.place.address}</p>
                                </div>
                                <div className='text-right shrink-0'>
                                    <p className='text-lg font-bold text-stone-900'>{entry.average.toFixed(1)}</p>
                                    <p className='text-xs text-stone-400'>{entry.count} visit{entry.count !== 1 ? 's' : ''}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className='text-stone-400'>No rated places yet. Log some visits or follow people to build your leaderboard.</p>
            )}
        </div>
    );
}
