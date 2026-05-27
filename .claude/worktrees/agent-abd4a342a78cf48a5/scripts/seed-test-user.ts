import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'e2e-test@places-i-ate.internal' },
        update: {},
        create: {
            email: 'e2e-test@places-i-ate.internal',
            name: 'E2E Test User',
        },
    });
    console.log('Seeded test user:', user.id);
}

main().finally(() => prisma.$disconnect());
