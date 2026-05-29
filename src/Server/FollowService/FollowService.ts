import prisma from '@/lib/prisma';

export class FollowService {
  async follow(followerId: string, followingId: string): Promise<void> {
    await prisma.follow.create({ data: { followerId, followingId } });
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await prisma.follow.deleteMany({ where: { followerId, followingId } });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const f = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
      select: { id: true },
    });
    return f !== null;
  }

  async getFollowerCount(userId: string): Promise<number> {
    return prisma.follow.count({ where: { followingId: userId } });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return prisma.follow.count({ where: { followerId: userId } });
  }

  async getFollowingIds(userId: string): Promise<string[]> {
    const rows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return rows.map((r: { followingId: string }) => r.followingId);
  }
}

export const followService = new FollowService();
