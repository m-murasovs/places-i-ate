import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export type PublicUser = Pick<User, 'id' | 'username' | 'name' | 'image' | 'bio'>;

export class UserService {
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

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

  async updateBio(userId: string, bio: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { bio },
    });
  }
}

export const userService = new UserService();
