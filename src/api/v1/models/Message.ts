import mongoose, { Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

export interface Message extends Document {
  email: string;
  content: string;
  date: Date;
}

const MessageSchema = new Schema<Message>({
  email: requiredStringSchema,
  content: requiredStringSchema,
  date: { type: Date, required: true },
});

const MessageModel = mongoose.model("message", MessageSchema);

export default MessageModel;
