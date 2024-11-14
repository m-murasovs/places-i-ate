import { Schema, model } from "mongoose";
import { User } from 'types';

const UserSchema = new Schema<User>({
    _id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Email is invalid",
        ],
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    }
}, {
    timestamps: true,
    collection: "users"
}
);

const User = model<User>('User', UserSchema);

export default User;
