import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema, stringSchema } from "./CommonSchemas";

export interface Project extends Document {
  title: string;
  summary: string;
  githubLink: string;
  tags: string;
}

const ProjectSchema = new Schema<Project>({
  title: requiredStringSchema,
  summary: requiredStringSchema,
  githubLink: requiredStringSchema,
  tags: stringSchema,
});

const ProjectModel = mongoose.model<Project>("project", ProjectSchema);

export default ProjectModel;
