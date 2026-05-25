import prisma from '@/lib/prisma';
import { Place } from '@prisma/client';

export class PlaceService {
  async createPlace(data: {
    googlePlacesId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber?: string;
    website?: string;
  }): Promise<Place> {
    const place = await prisma.place.create({
      data,
    });
    return place;
  }

  async getPlaceById(id: string): Promise<Place | null> {
    const place = await prisma.place.findUnique({
      where: { id },
    });
    return place;
  }

  async getPlaceByGoogleId(googlePlacesId: string): Promise<Place | null> {
    const place = await prisma.place.findUnique({
      where: { googlePlacesId },
    });
    return place;
  }

  async deletePlace(id: string): Promise<void> {
    await prisma.place.delete({
      where: { id },
    });
  }

  async searchPlaces(query: string, limit: number = 10): Promise<Place[]> {
    const places = await prisma.place.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        NOT: {
          AND: [{ latitude: 0 }, { longitude: 0 }],
        },
      },
      take: limit,
    });
    return places;
  }
}

export const placeService = new PlaceService();
