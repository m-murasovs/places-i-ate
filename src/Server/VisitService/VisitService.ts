import prisma from '@/lib/prisma';
import { Visit, Place } from '@prisma/client';

export type VisitWithPlace = Visit & { place: Place };

export type RatingType = '1' | '2' | '3' | '4' | '5' | 'S';

export type SortType = 'date' | 'rating' | 'name';

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
  async createVisit(data: {
    userId: string;
    placeId: string;
    rating: RatingType;
    review?: string;
    visitDate: Date;
    visitedWithUserIds?: string[];
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
    sort: SortType = 'date'
  ): Promise<VisitWithPlace[]> {
    const visits = await prisma.visit.findMany({
      where: { userId },
      include: {
        place: true,
      },
      orderBy: getOrderBy(sort),
      take: limit,
      skip: offset,
    });
    return visits;
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

  async getVisitsByRating(userId: string, rating: RatingType, sort: SortType = 'date', limit: number = 50, offset: number = 0): Promise<VisitWithPlace[]> {
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
    return visits;
  }
}

export const visitService = new VisitService();
