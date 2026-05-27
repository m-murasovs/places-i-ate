'use server';

import { auth } from '@/auth';
import { userService } from '../UserService/UserService';
import { followService } from '../FollowService/FollowService';
import { visitService } from '../VisitService/VisitService';

function slugifyUsername(raw: string): string {
    return raw.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_{2,}/g, '_').replace(/^_|_$/g, '');
}

export const claimUsername = async (desired: string, bio?: string) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const slug = slugifyUsername(desired);
    if (slug.length < 2 || slug.length > 30) throw new Error('Username must be 2-30 characters');

    const taken = await userService.isUsernameTaken(slug);
    if (taken) throw new Error('Username is taken');

    return userService.setUsername(session.user.id, slug, bio);
};

export const getPublicProfile = async (username: string) => {
    const user = await userService.getUserByUsername(username);
    if (!user) return null;

    const [visits, followerCount, followingCount] = await Promise.all([
        visitService.getUserVisits(user.id, 50, 0, 'date'),
        followService.getFollowerCount(user.id),
        followService.getFollowingCount(user.id),
    ]);

    return {
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            image: user.image,
            bio: user.bio,
        },
        visits,
        followerCount,
        followingCount,
    };
};

export const followUser = async (targetId: string) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');
    if (session.user.id === targetId) throw new Error('Cannot follow yourself');
    await followService.follow(session.user.id, targetId);
};

export const unfollowUser = async (targetId: string) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');
    await followService.unfollow(session.user.id, targetId);
};

export const checkFollowing = async (targetId: string) => {
    const session = await auth();
    if (!session?.user?.id) return false;
    return followService.isFollowing(session.user.id, targetId);
};

export const searchUsers = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 3) return [];
    return userService.searchUsers(trimmed, 10);
};
