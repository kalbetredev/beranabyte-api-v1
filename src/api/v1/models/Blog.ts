import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

export interface Blog extends Document {
  tile: string;
  category: string;
  isFeatured: boolean;
  isPublished: boolean;
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
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, required: true },
  summary: { type: String },
  imageUrl: { type: String },
  viewCount: { type: Number, required: true },
  mdx: { type: String },
});

const BlogModel = mongoose.model<Blog>("blog", BlogSchema);

export default BlogModel;
