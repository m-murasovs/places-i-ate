import prisma from '@/lib/prisma';
import { Place } from '@prisma/client';

export class PlaceService {
  /**
   * Create a new place
   */
  async createPlace(data: {
    googlePlacesId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber?: string;
    website?: string;
  }): Promise<Place | null> {
    try {
      const place = await prisma.place.create({
        data,
      });
      return place;
    } catch (error) {
      console.error('Error creating place:', error);
      return null;
    }
  }

  /**
   * Get a place by ID
   */
  async getPlaceById(id: string): Promise<Place | null> {
    try {
      const place = await prisma.place.findUnique({
        where: { id },
      });
      return place;
    } catch (error) {
      console.error('Error fetching place:', error);
      return null;
    }
  }

  /**
   * Get a place by Google Places ID
   */
  async getPlaceByGoogleId(googlePlacesId: string): Promise<Place | null> {
    try {
      const place = await prisma.place.findUnique({
        where: { googlePlacesId },
      });
      return place;
    } catch (error) {
      console.error('Error fetching place by Google ID:', error);
      return null;
    }
  }

  /**
   * Update a place
   */
  async updatePlace(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Promise<Place | null> {
    try {
      const place = await prisma.place.update({
        where: { id },
        data,
      });
      return place;
    } catch (error) {
      console.error('Error updating place:', error);
      return null;
    }
  }

  /**
   * Delete a place
   */
  async deletePlace(id: string): Promise<boolean> {
    try {
      await prisma.place.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Error deleting place:', error);
      return false;
    }
  }

  /**
   * Get all unique places visited by users
   */
  async getAllPlaces(limit: number = 100, offset: number = 0): Promise<Place[]> {
    try {
      const places = await prisma.place.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      });
      return places;
    } catch (error) {
      console.error('Error fetching all places:', error);
      return [];
    }
  }

  /**
   * Search places by name
   */
  async searchPlaces(query: string, limit: number = 10): Promise<Place[]> {
    try {
      const places = await prisma.place.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        take: limit,
      });
      return places;
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }
}

export const placeService = new PlaceService();
