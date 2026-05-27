import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export type PublicUser = Pick<User, 'id' | 'username' | 'name' | 'image' | 'bio'>;

export class UserService {
  async getUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    return user !== null;
  }

  async setUsername(userId: string, username: string, bio?: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { username, bio },
    });
  }

  async searchUsers(query: string, limit: number = 10): Promise<PublicUser[]> {
    return prisma.user.findMany({
      where: {
        AND: [
          { username: { not: null } },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: { id: true, username: true, name: true, image: true, bio: true },
      take: limit,
    });
  }
}

export const userService = new UserService();
