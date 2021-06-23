import mongoose, { Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

const BlogSchema = new Schema({
  title: { ...requiredStringSchema, unique: true },
  category: requiredStringSchema,
  publishedAt: { type: Date, required: true },
  summary: requiredStringSchema,
  imageUrl: requiredStringSchema,
  viewCount: { type: Number, required: true },
  mdx: requiredStringSchema,
});

const Blog = mongoose.model("blog", BlogSchema);

export default Blog;
