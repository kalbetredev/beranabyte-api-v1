import mongoose, { Document, Schema } from "mongoose";

export interface BlogImage extends Document {
  imageId: string;
  fileName: string;
  blogId: string;
  userId: string;
}

const BlogImageSchema = new Schema<BlogImage>({
  imageId: { type: String, required: true },
  fileName: { type: String, required: true },
  blogId: { type: String, required: true },
  userId: { type: String, required: true },
});

const BlogImageModel = mongoose.model<BlogImage>("blogImage", BlogImageSchema);

export default BlogImageModel;
