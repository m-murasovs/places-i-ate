import { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

const isE2E = process.env.E2E_TEST === 'true' && process.env.NODE_ENV !== 'production';

const e2eProvider = Credentials({
    id: 'e2e-credentials',
    name: 'E2E Test',
    credentials: {
        token: { label: 'Token', type: 'password' },
    },
    async authorize(credentials) {
        const expectedToken = process.env.E2E_SECRET_TOKEN;
        if (!isE2E || !expectedToken) return null;
        if (credentials?.token !== expectedToken) return null;
        return {
            id: 'e2e-placeholder',
            email: 'e2e-test@places-i-ate.internal',
            name: 'E2E Test User',
        };
    },
});

export const authConfig: NextAuthConfig = {
    providers: isE2E ? [GitHub, e2eProvider] : [GitHub],
    callbacks: {
        session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string;
            }
            session.user.username = (token?.username as string) ?? null;
            return session;
        },
    },
};
