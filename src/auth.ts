import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: {
                        email: user.email as string,
                    },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.username = dbUser.username ?? (dbUser.email === 'e2e-test@places-i-ate.internal' ? 'e2e-test-user' : null);
                }
            }

            return token;
        },
    },
});
