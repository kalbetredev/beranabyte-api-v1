import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

export interface Blog extends Document {
  authorId: string;
  title: string;
  topic: string;
  isFeatured: boolean;
  isPublished: boolean;
  publishedOn: Date;
  lastModifiedOn: Date;
  summary: string;
  imageUrl: string;
  viewCount: Number;
  content: string;
  linkedProjects: string[];
}

const BlogSchema = new Schema<Blog>({
  authorId: { type: String, required: true },
  title: { ...requiredStringSchema, unique: true },
  topic: requiredStringSchema,
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  publishedOn: { type: Date },
  lastModifiedOn: { type: Date, required: true },
  summary: { type: String },
  imageUrl: { type: String },
  viewCount: { type: Number, default: 0 },
  content: { type: String },
});

const BlogModel = mongoose.model<Blog>("blog", BlogSchema);

export default BlogModel;
