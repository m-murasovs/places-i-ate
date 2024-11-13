import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import mongoose from 'mongoose';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@restaurants.qoimd.mongodb.net/restaurants`;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error(err);
    });

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: [
                'https://places-i-ate.vercel.app',
                'https://places-i-ate-git-main-mmurasovs-projects.vercel.app/',
                'http://localhost:3000'
            ]
        }),
        express.json(),
        expressMiddleware(server),
    );

    (async () => {
        await new Promise<void>((resolve) => httpServer.listen({ port: 8080 }, resolve));
    })();
    console.log(`🚀 Server ready at http://localhost:8080/graphql`);
})();



