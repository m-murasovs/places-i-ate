import { auth } from '@/auth';
import { getPublicProfile, checkFollowing } from '@/Server/actions/UserActions';
import { notFound } from 'next/navigation';
import { VisitWithPlace } from '@/Server/VisitService/VisitService';
import VisitCard from '@/components/VisitCard';
import FollowButton from './FollowButton';
import dynamic from 'next/dynamic';

const VisitMap = dynamic(() => import('@/components/VisitMap'), {
    ssr: false,
    loading: () => (
        <div className='h-[400px] w-full bg-stone-200 rounded-lg animate-pulse'></div>
    ),
});

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const profile = await getPublicProfile(username);
    if (!profile) notFound();

    const session = await auth();
    const isOwnProfile = session?.user?.id === profile.user.id;
    const isFollowing = session?.user?.id
        ? await checkFollowing(profile.user.id)
        : false;

    return (
        <div>
            <div className='mb-8'>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                        {profile.user.image && (
                            <img
                                src={profile.user.image}
                                alt={profile.user.name ?? ''}
                                className='w-16 h-16 rounded-full'
                            />
                        )}
                        <div>
                            <h1 className='text-2xl font-bold text-stone-900'>
                                {profile.user.name ?? profile.user.username}
                            </h1>
                            <p className='text-stone-500'>@{profile.user.username}</p>
                            {profile.user.bio && (
                                <p className='text-stone-600 mt-1'>{profile.user.bio}</p>
                            )}
                        </div>
                    </div>
                    {!isOwnProfile && session?.user && (
                        <FollowButton targetId={profile.user.id} initialIsFollowing={isFollowing} />
                    )}
                </div>

                <div className='flex gap-4 mt-4 text-sm text-stone-600'>
                    <span><strong>{profile.followerCount}</strong> follower{profile.followerCount !== 1 ? 's' : ''}</span>
                    <span><strong>{profile.followingCount}</strong> following</span>
                    <span><strong>{profile.visits.length}</strong> visit{profile.visits.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {profile.visits.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-xl font-semibold text-stone-800 mb-4'>Map</h2>
                    <VisitMap visits={profile.visits as VisitWithPlace[]} />
                </div>
            )}

            <div>
                <h2 className='text-xl font-semibold text-stone-800 mb-4'>Visits</h2>
                {profile.visits.length > 0 ? (
                    <ul>
                        {profile.visits.map((visit) => (
                            <VisitCard key={visit.id} visit={visit as VisitWithPlace} readOnly />
                        ))}
                    </ul>
                ) : (
                    <p className='text-stone-500'>No visits yet.</p>
                )}
            </div>
        </div>
    );
}
