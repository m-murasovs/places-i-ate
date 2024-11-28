import { ObjectId } from 'mongodb';

export interface ItemId {
    _id: ObjectId | string;
}
