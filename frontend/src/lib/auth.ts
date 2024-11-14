import type { NextAuthOptions } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { gql } from '@apollo/client';
import { client } from './ApolloWrapper';

interface LoginCredentials {
    email: string | undefined,
    password?: string | undefined,
}

const LOGIN = gql`
    query Login {
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
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials as LoginCredentials;

                const { data } = await client.query({
                    query: LOGIN,
                    variables: { email, password }
                });

                return data;
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
