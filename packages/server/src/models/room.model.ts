import { Schema, model, Document, Types } from "mongoose";

export interface IRoom extends Document {
    name: string;
}

const roomSchema = new Schema<IRoom>({
    name: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v;
            return ret;
        }
    }
});

export const RoomModel = model<IRoom>("Room", roomSchema);
