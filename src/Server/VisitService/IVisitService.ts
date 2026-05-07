import { Visit } from '@prisma/client';

export type RatingType = '1' | '2' | '3' | '4' | '5' | 'S';

export interface IVisitService {
  createVisit(data: {
    userId: string;
    placeId: string;
    rating: RatingType;
    review?: string;
    visitDate: Date;
    visitedWithUserIds?: string[];
  }): Promise<Visit | null>;

  getVisitById(id: string): Promise<Visit | null>;

  updateVisit(
    id: string,
    data: Partial<Omit<Visit, 'id' | 'userId' | 'placeId' | 'createdAt'>>
  ): Promise<Visit | null>;

  deleteVisit(id: string): Promise<boolean>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserVisits(userId: string, limit?: number, offset?: number): Promise<(Visit & { place?: any })[]>;

  getUserVisitCount(userId: string): Promise<number>;

  getPlaceVisits(placeId: string): Promise<Visit[]>;

  getUserPlaceVisits(userId: string, placeId: string): Promise<Visit[]>;

  getAllVisits(limit?: number, offset?: number): Promise<Visit[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getVisitsByRating(userId: string, rating: RatingType): Promise<(Visit & { place?: any })[]>;
}
