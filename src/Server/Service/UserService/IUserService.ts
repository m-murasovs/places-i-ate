import { Document, Filter, FindOptions, ObjectId } from 'mongodb';

export interface IUser extends Document {
    _id: ObjectId;
    email: string;
    name: string;
    emailVerified: Date;
    password: string;
    image?: string;
};

export interface IUserService {
    searchUser(
        filter: Filter<IUser>,
        fields: FindOptions<IUser>,
    ): Promise<IUser | null>;

    createUser(data: IUser): Promise<IUser | null>;
}
