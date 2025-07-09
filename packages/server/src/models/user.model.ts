import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

export const UserModel = model<IUser>("User", userSchema);
