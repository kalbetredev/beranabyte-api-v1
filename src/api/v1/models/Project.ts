import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema, stringSchema } from "./CommonSchemas";

export interface Project extends Document {
  title: string;
  summary: string;
  githubLink: string;
  tags: string[];
  liveDemoLink: string;
  techStack: string[];
  type: string;
  publishedOn: Date;
  isFeatured: boolean;
}

const ProjectSchema = new Schema<Project>({
  title: requiredStringSchema,
  summary: requiredStringSchema,
  githubLink: requiredStringSchema,
  liveDemoLink: requiredStringSchema,
  type: requiredStringSchema,
  publishedOn: { type: Date },
  isFeatured: { type: Boolean, default: false },
});

const ProjectModel = mongoose.model<Project>("project", ProjectSchema);

export default ProjectModel;
