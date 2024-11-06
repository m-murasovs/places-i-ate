'use client';
import { HttpLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

function makeClient() {
    const httpLink = new HttpLink({
        uri: "http://localhost:8080",
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
