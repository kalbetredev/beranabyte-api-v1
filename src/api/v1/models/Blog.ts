import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

export interface Blog extends Document {
  authorId: string;
  title: string;
  category: string;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: Date;
  lastModifiedAt: Date;
  summary: string;
  imageUrl: string;
  viewCount: Number;
  mdx: string;
}

const BlogSchema = new Schema<Blog>({
  authorId: { type: String, required: true },
  title: { ...requiredStringSchema, unique: true },
  category: requiredStringSchema,
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, required: true },
  lastModifiedAt: { type: Date, required: true },
  summary: { type: String },
  imageUrl: { type: String },
  viewCount: { type: Number, required: true },
  mdx: { type: String },
});

const BlogModel = mongoose.model<Blog>("blog", BlogSchema);

export default BlogModel;
