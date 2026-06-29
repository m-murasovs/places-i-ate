import prisma from '@/lib/prisma';
import { Visit, Place, User } from '@prisma/client';

export type VisitWithPlace = Visit & { place: Place };

export type TaggedUser = Pick<User, 'id' | 'username' | 'name' | 'image'>;

export type VisitWithPlaceAndTags = VisitWithPlace & { taggedUsers: TaggedUser[] };

export type RatingType = '1' | '2' | '3' | '4' | '5' | 'S';

export type SortType = 'date' | 'rating' | 'name';

export type VisibilityType = 'public' | 'followers' | 'private';

function getOrderBy(sort: SortType) {
  switch (sort) {
    case 'rating':
      return { rating: 'desc' as const };
    case 'name':
      return { place: { name: 'asc' as const } };
    case 'date':
    default:
      return { visitDate: 'desc' as const };
  }
}

export class VisitService {
  private async resolveTaggedUsers(visits: VisitWithPlace[]): Promise<VisitWithPlaceAndTags[]> {
    const allIds = new Set(visits.flatMap(v => v.visitedWithUserIds));

    if (allIds.size === 0) {
      return visits.map(v => ({ ...v, taggedUsers: [] }));
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(allIds) },
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
      },
    });

    const userMap = new Map<string, TaggedUser>(users.map((u: TaggedUser) => [u.id, u]));

    return visits.map(v => ({
      ...v,
      taggedUsers: v.visitedWithUserIds
        .map(id => userMap.get(id))
        .filter((u): u is TaggedUser => u !== undefined),
    }));
  }

  async createVisit(data: {
    userId: string;
    placeId: string;
    rating: RatingType;
    review?: string;
    visitDate: Date;
    visitedWithUserIds?: string[];
    visibility?: VisibilityType;
  }): Promise<Visit> {
    const visit = await prisma.visit.create({
      data: {
        ...data,
        visitedWithUserIds: data.visitedWithUserIds || [],
      },
    });
    return visit;
  }

  async getVisitById(id: string): Promise<Visit | null> {
    const visit = await prisma.visit.findUnique({
      where: { id },
    });
    return visit;
  }

  async updateVisit(
    id: string,
    data: Partial<Omit<Visit, 'id' | 'userId' | 'placeId' | 'createdAt'>>
  ): Promise<Visit> {
    const visit = await prisma.visit.update({
      where: { id },
      data,
    });
    return visit;
  }

  async deleteVisit(id: string): Promise<void> {
    await prisma.visit.delete({
      where: { id },
    });
  }

  async getUserVisits(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    sort: SortType = 'date',
    visibilityIn?: VisibilityType[]
  ): Promise<VisitWithPlaceAndTags[]> {
    const visits = await prisma.visit.findMany({
      where: { userId, ...(visibilityIn ? { visibility: { in: visibilityIn } } : {}) },
      include: {
        place: true,
      },
      orderBy: getOrderBy(sort),
      take: limit,
      skip: offset,
    });
    return this.resolveTaggedUsers(visits);
  }

  async getUserVisitCount(userId: string): Promise<number> {
    const count = await prisma.visit.count({
      where: { userId },
    });
    return count;
  }

  async getUserVisitCountByRating(userId: string, rating: RatingType): Promise<number> {
    const count = await prisma.visit.count({
      where: { userId, rating },
    });
    return count;
  }

  async getVisitsByRating(userId: string, rating: RatingType, sort: SortType = 'date', limit: number = 50, offset: number = 0): Promise<VisitWithPlaceAndTags[]> {
    const visits = await prisma.visit.findMany({
      where: {
        userId,
        rating,
      },
      include: {
        place: true,
      },
      orderBy: getOrderBy(sort),
      take: limit,
      skip: offset,
    });
    return this.resolveTaggedUsers(visits);
  }
}

export const visitService = new VisitService();
