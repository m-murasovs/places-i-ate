'use client';

import { useState } from 'react';
import { followUser, unfollowUser } from '@/Server/actions/UserActions';
import { PrimaryButton, SecondaryButton } from '@/components/button';

export default function FollowButton({
    targetId,
    initialIsFollowing,
}: {
    targetId: string;
    initialIsFollowing: boolean;
}) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, setIsPending] = useState(false);

    const handleClick = async () => {
        setIsPending(true);
        try {
            if (isFollowing) {
                await unfollowUser(targetId);
                setIsFollowing(false);
            } else {
                await followUser(targetId);
                setIsFollowing(true);
            }
        } finally {
            setIsPending(false);
        }
    };

    if (isFollowing) {
        return (
            <SecondaryButton onClick={handleClick} disabled={isPending}>
                {isPending ? '...' : 'Following'}
            </SecondaryButton>
        );
    }

    return (
        <PrimaryButton onClick={handleClick} disabled={isPending}>
            {isPending ? '...' : 'Follow'}
        </PrimaryButton>
    );
}
