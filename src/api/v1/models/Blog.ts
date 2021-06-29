import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

export interface Blog extends Document {
  tile: string;
  category: string;
  isFeatured: boolean;
  publishedAt: Date;
  summary: string;
  imageUrl: string;
  viewCount: Number;
  mdx: string;
}

const BlogSchema = new Schema<Blog>({
  title: { ...requiredStringSchema, unique: true },
  category: requiredStringSchema,
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date, required: true },
  summary: requiredStringSchema,
  imageUrl: requiredStringSchema,
  viewCount: { type: Number, required: true },
  mdx: requiredStringSchema,
});

const BlogModel = mongoose.model<Blog>("blog", BlogSchema);

export default BlogModel;
