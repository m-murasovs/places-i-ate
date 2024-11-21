export interface IUser extends Document {
    _id: string;
    email: string;
    name: string;
    emailVerified: Date;
    password: string;
    image?: string;
};

export interface IUserService {
    searchUser(
        filter: Partial<IUser>,
        fields: Record<string, unknown>,
    ): Promise<IUser | null>;

    createUser(data: IUser): Promise<IUser | null>;
}
