import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver?: Types.ObjectId;
  room?: Types.ObjectId;
  text: string;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: false },
  room: { type: Schema.Types.ObjectId, ref: "Room", required: false },
  text: { type: String, required: true }
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
            ret.id = ret._id;
            delete ret._id
            delete ret.__v;
            return ret;
        }
    }
});

export const MessageModel = model<IMessage>("Message", messageSchema);
