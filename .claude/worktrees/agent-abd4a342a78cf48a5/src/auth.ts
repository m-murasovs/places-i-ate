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
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: {
                        email: user.email as string,
                    },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string;
            }

            return session;
        },
    },
});
