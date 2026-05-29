import StarBadge from './StarBadge';

const RATING_BADGE_CLASSES: Record<string, string> = {
    'S': 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white',
    '5': 'bg-lime-500 text-white',
    '4': 'bg-teal-400 text-white',
    '3': 'bg-amber-400 text-stone-800',
    '2': 'bg-orange-500 text-white',
    '1': 'bg-red-500 text-white',
};

export default function RatingBadge({ rating, size = 32 }: { rating: string; size?: number }) {
    if (rating === 'S') {
        return <StarBadge label='S' size={size} className='text-amber-400' />;
    }
    return (
        <span
            className={`inline-flex items-center justify-center shrink-0 rounded-full font-bold text-sm ${RATING_BADGE_CLASSES[rating] ?? 'bg-stone-400 text-white'}`}
            style={{ width: size, height: size }}
        >
            {rating}
        </span>
    );
}
