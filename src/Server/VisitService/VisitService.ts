import prisma from '@/lib/prisma';
import { Visit } from '@prisma/client';

export type RatingType = '1' | '2' | '3' | '4' | '5' | 'S';

export class VisitService {
  /**
   * Create a new visit record
   */
  async createVisit(data: {
    userId: string;
    placeId: string;
    rating: RatingType;
    review?: string;
    visitDate: Date;
    visitedWithUserIds?: string[];
  }): Promise<Visit | null> {
    try {
      const visit = await prisma.visit.create({
        data: {
          ...data,
          visitedWithUserIds: data.visitedWithUserIds || [],
        },
      });
      return visit;
    } catch (error) {
      console.error('Error creating visit:', error);
      return null;
    }
  }

  /**
   * Get a visit by ID
   */
  async getVisitById(id: string): Promise<Visit | null> {
    try {
      const visit = await prisma.visit.findUnique({
        where: { id },
      });
      return visit;
    } catch (error) {
      console.error('Error fetching visit:', error);
      return null;
    }
  }

  /**
   * Update a visit
   */
  async updateVisit(
    id: string,
    data: Partial<Omit<Visit, 'id' | 'userId' | 'placeId' | 'createdAt'>>
  ): Promise<Visit | null> {
    try {
      const visit = await prisma.visit.update({
        where: { id },
        data,
      });
      return visit;
    } catch (error) {
      console.error('Error updating visit:', error);
      return null;
    }
  }

  /**
   * Delete a visit
   */
  async deleteVisit(id: string): Promise<boolean> {
    try {
      await prisma.visit.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Error deleting visit:', error);
      return false;
    }
  }

  /**
   * Get all visits for a user with place details
   */
  async getUserVisits(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<(Visit & { place?: Record<string, unknown> })[]> {
    try {
      const visits = await prisma.visit.findMany({
        where: { userId },
        include: {
          place: true,
        },
        orderBy: { visitDate: 'desc' },
        take: limit,
        skip: offset,
      });
      return visits;
    } catch (error) {
      console.error('Error fetching user visits:', error);
      return [];
    }
  }

  /**
   * Get count of user visits
   */
  async getUserVisitCount(userId: string): Promise<number> {
    try {
      const count = await prisma.visit.count({
        where: { userId },
      });
      return count;
    } catch (error) {
      console.error('Error fetching user visit count:', error);
      return 0;
    }
  }

  /**
   * Get visits for a specific place
   */
  async getPlaceVisits(placeId: string): Promise<Visit[]> {
    try {
      const visits = await prisma.visit.findMany({
        where: { placeId },
        orderBy: { visitDate: 'desc' },
      });
      return visits;
    } catch (error) {
      console.error('Error fetching place visits:', error);
      return [];
    }
  }

  /**
   * Get user's visits for a specific place (there can be multiple if they revisit)
   */
  async getUserPlaceVisits(userId: string, placeId: string): Promise<Visit[]> {
    try {
      const visits = await prisma.visit.findMany({
        where: {
          userId,
          placeId,
        },
        orderBy: { visitDate: 'desc' },
      });
      return visits;
    } catch (error) {
      console.error('Error fetching user place visits:', error);
      return [];
    }
  }

  /**
   * Get all visits across all users (for admin/analytics)
   */
  async getAllVisits(limit: number = 100, offset: number = 0): Promise<Visit[]> {
    try {
      const visits = await prisma.visit.findMany({
        orderBy: { visitDate: 'desc' },
        take: limit,
        skip: offset,
      });
      return visits;
    } catch (error) {
      console.error('Error fetching all visits:', error);
      return [];
    }
  }

  /**
   * Get visits by rating
   */
  async getVisitsByRating(userId: string, rating: RatingType): Promise<(Visit & { place?: Record<string, unknown> })[]> {
    try {
      const visits = await prisma.visit.findMany({
        where: {
          userId,
          rating,
        },
        include: {
          place: true,
        },
        orderBy: { visitDate: 'desc' },
      });
      return visits;
    } catch (error) {
      console.error('Error fetching visits by rating:', error);
      return [];
    }
  }
}

export const visitService = new VisitService();
