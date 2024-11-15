import { HttpLink, InMemoryCache, ApolloClient } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: 'https://places-i-ate.onrender.com/graphql',
            // uri: 'http://localhost:8080/graphql',
        }),
    });
});
