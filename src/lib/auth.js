import credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';
import mongoose from 'mongoose';

const User = mongoose.model('User');

export const authOptions = {
    providers: [
        credentials({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                await connectDB();

                const user = await User.findOne({ email: credentials?.email }).select('+password');
                if (!user) return null;

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordMatch) return null;

                return user;
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
