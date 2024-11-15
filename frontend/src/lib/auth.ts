import type { NextAuthOptions } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { gql } from '@apollo/client';
import { getClient } from './client';
import bcrypt from 'bcryptjs';

interface LoginCredentials {
    email: string,
    password: string,
}

const LOGIN = gql`
    mutation Login {
        login(email: $email, password: $password) {
            email
            password
        }
}`;

export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const { email, password } = credentials as LoginCredentials;

                try {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const { data } = await getClient().mutate({
                        mutation: LOGIN,
                        variables: { email, password: hashedPassword }
                    });

                    return data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
    }
};

/**
 * so, this is on the server and we're trying to use the ApolloClient to execute the login query.
 * but the ApolloClient is defined on the client (fe) and we need it on the server.
 * so we need some way to access the other server from the next server
 */
