import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

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

                if (!dbUser) {
                    await prisma.user.create({
                        data: {
                            _id: crypto.randomBytes(16).toString('hex'),
                            email: user.email as string,
                            name: user.name as string,
                            image: user.image as string,
                            emailVerified: new Date(),
                        },
                    });
                } else {
                    token = { ...token, ...dbUser };
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session = { ...session, ...token };
            }

            return session;
        },

        redirect() {
            return '/login';
        },
    },
});
