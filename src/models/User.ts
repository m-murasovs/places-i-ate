// import mongoose, { Schema } from 'mongoose';
// import { type User as UserType } from '@/types';

// const UserSchema = new Schema<UserType>({
//     _id: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: [true, 'Email is required'],
//         match: [
//             /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//             'Email is invalid',
//         ],
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: [true, 'Name is required']
//     }
// }, {
//     timestamps: true,
//     collection: 'users'
// }
// );

// const UserModel = mongoose.model('User', UserSchema);

// export const User = (mongoose.models.User as typeof UserModel) || UserModel;

// console.log(User);
