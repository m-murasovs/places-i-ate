import { getPlaceDetail } from '@/Server/actions/PlaceActions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import RatingBadge from '@/components/RatingBadge';
import BookmarkButton from './BookmarkButton';
import { VisitWithAuthor } from '@/Server/PlaceService/PlaceServicePrisma';

function VisitRow({ visit }: { visit: VisitWithAuthor }) {
    return (
        <li className='flex items-start gap-3 p-3 border-b border-stone-100 last:border-0'>
            {visit.user.image ? (
                <Image src={visit.user.image} alt='' className='w-9 h-9 rounded-full' width={36} height={36} />
            ) : (
                <div className='w-9 h-9 rounded-full bg-stone-200' />
            )}
            <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                    {visit.user.username ? (
                        <Link href={`/u/${visit.user.username}`} className='font-medium text-stone-900 hover:underline'>
                            {visit.user.name || `@${visit.user.username}`}
                        </Link>
                    ) : (
                        <span className='font-medium text-stone-900'>{visit.user.name}</span>
                    )}
                    <RatingBadge rating={visit.rating} size={28} />
                </div>
                {visit.review && <p className='text-sm text-stone-700 mt-1'>{visit.review}</p>}
                <p className='text-xs text-stone-400 mt-1'>{new Date(visit.visitDate).toLocaleDateString()}</p>
            </div>
        </li>
    );
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const detail = await getPlaceDetail(id);
    if (!detail) notFound();

    const { place, aggregate, yourVisits, friendVisits, isBookmarked } = detail;

    return (
        <div className='max-w-2xl mx-auto'>
            <div className='mb-6 flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                    <h1 className='text-2xl font-bold text-stone-900'>{place.name}</h1>
                    <p className='text-stone-500'>{place.address}</p>
                </div>
                {yourVisits.length === 0 && (
                    <BookmarkButton placeId={place.id} initialBookmarked={isBookmarked} />
                )}
            </div>

            <div className='flex items-center gap-6 mb-8 p-4 bg-white border border-stone-200 rounded-xl'>
                <div className='text-center'>
                    <div className='text-3xl font-bold text-stone-900'>
                        {aggregate.average !== null ? aggregate.average.toFixed(1) : '—'}
                    </div>
                    <div className='text-xs text-stone-500'>avg rating</div>
                </div>
                <div className='text-center'>
                    <div className='text-3xl font-bold text-stone-900'>{aggregate.count}</div>
                    <div className='text-xs text-stone-500'>visit{aggregate.count !== 1 ? 's' : ''}</div>
                </div>
                {aggregate.sTierCount > 0 && (
                    <div className='text-center'>
                        <div className='text-3xl font-bold text-amber-500'>{aggregate.sTierCount}</div>
                        <div className='text-xs text-stone-500'>S-tier</div>
                    </div>
                )}
            </div>

            <section className='mb-8'>
                <h2 className='text-lg font-semibold text-stone-800 mb-2'>Friends also rated this</h2>
                {friendVisits.length > 0 ? (
                    <ul className='bg-white border border-stone-200 rounded-xl'>
                        {friendVisits.map(v => <VisitRow key={v.id} visit={v} />)}
                    </ul>
                ) : (
                    <p className='text-stone-400 text-sm'>No one you follow has rated this place yet.</p>
                )}
            </section>

            {yourVisits.length > 0 && (
                <section>
                    <h2 className='text-lg font-semibold text-stone-800 mb-2'>Your visits</h2>
                    <ul className='bg-white border border-stone-200 rounded-xl'>
                        {yourVisits.map(v => <VisitRow key={v.id} visit={v} />)}
                    </ul>
                </section>
            )}
        </div>
    );
}
