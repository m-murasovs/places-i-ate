import { PrismaClient } from '@prisma/client';

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
if (!APIFY_TOKEN) throw new Error('APIFY_API_TOKEN env variable is required');
const DATASET_URL = `https://api.apify.com/v2/datasets/ZorPq4yc3uheeGOKZ/items?token=${APIFY_TOKEN}`;

const prisma = new PrismaClient();

interface ApifyPlace {
    placeId: string;
    title: string;
    address: string;
    location: { lat: number; lng: number };
    phone?: string;
    phoneUnformatted?: string;
    url?: string;
    categoryName?: string;
}

async function main() {
    console.log('Fetching places from Apify dataset...');
    const res = await fetch(DATASET_URL);
    const places: ApifyPlace[] = await res.json();
    console.log(`Fetched ${places.length} places.`);

    let created = 0;
    let skipped = 0;

    for (const place of places) {
        if (!place.placeId || !place.title || !place.address) {
            skipped++;
            continue;
        }

        try {
            await prisma.place.upsert({
                where: { googlePlacesId: place.placeId },
                update: {
                    name: place.title,
                    address: place.address,
                    latitude: place.location?.lat ?? 0,
                    longitude: place.location?.lng ?? 0,
                    phoneNumber: place.phoneUnformatted || place.phone || undefined,
                    website: place.url || undefined,
                },
                create: {
                    googlePlacesId: place.placeId,
                    name: place.title,
                    address: place.address,
                    latitude: place.location?.lat ?? 0,
                    longitude: place.location?.lng ?? 0,
                    phoneNumber: place.phoneUnformatted || place.phone || undefined,
                    website: place.url || undefined,
                },
            });
            created++;
        } catch (err) {
            console.error(`Failed to upsert "${place.title}":`, err);
            skipped++;
        }
    }

    console.log(`Done. ${created} upserted, ${skipped} skipped.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
