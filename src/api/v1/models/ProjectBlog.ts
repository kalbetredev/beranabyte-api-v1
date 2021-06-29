import mongoose, { Document, Schema } from "mongoose";

export interface ProjectBlog extends Document {
  blogId: string;
  projectId: string;
  relationKey: string;
}

const ProjectBlogSchema = new Schema<ProjectBlog>({
  blogId: { type: String, required: true },
  projectId: { type: String, required: true },
  relationKey: { type: String, required: true, unique: true, dropDups: true },
});

const ProjectBlogModel = mongoose.model<ProjectBlog>(
  "projectBlog",
  ProjectBlogSchema
);

export default ProjectBlogModel;
