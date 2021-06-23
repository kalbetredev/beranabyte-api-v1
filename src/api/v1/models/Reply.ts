import mongoose, { Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

const ReplySchema = new Schema({
  commentId: requiredStringSchema,
  authorId: requiredStringSchema,
  text: requiredStringSchema,
  date: { type: Date, required: true },
});

const Reply = mongoose.model("reply", ReplySchema);

export default Reply;
