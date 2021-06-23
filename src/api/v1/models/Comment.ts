import mongoose, { Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

const CommentSchema = new Schema({
  blogId: requiredStringSchema,
  authorId: requiredStringSchema,
  text: requiredStringSchema,
  date: { type: Date, required: true },
});

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
