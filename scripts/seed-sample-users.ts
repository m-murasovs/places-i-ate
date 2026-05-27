import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_USERS = [
    { email: 'alice@example.com', name: 'Alice Chen', username: 'alice_chen', bio: 'Sushi lover and ramen enthusiast' },
    { email: 'bob@example.com', name: 'Bob Martinez', username: 'bob_eats', bio: 'Always hunting for the best tacos' },
    { email: 'carol@example.com', name: 'Carol Nowak', username: 'carol_foodie', bio: 'Pastry chef by day, food critic by night' },
    { email: 'dave@example.com', name: 'Dave Kim', username: 'dave_kim', bio: 'Street food explorer' },
];

async function main() {
    for (const user of SAMPLE_USERS) {
        const result = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, username: user.username, bio: user.bio },
            create: user,
        });
        console.log(`Seeded: @${result.username} (${result.id})`);
    }
}

main().finally(() => prisma.$disconnect());
