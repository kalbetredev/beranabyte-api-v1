import mongoose, { Schema } from "mongoose";
import { requiredStringSchema, stringSchema } from "./CommonSchemas";

export interface Bio {
  summary: string;
  facebookLink: string;
  telegramLink: string;
  linkedinLink: string;
  gitHubLink: string;
  email: string;
}

const BioSchema = new Schema<Bio>({
  summary: requiredStringSchema,
  facebookLink: stringSchema,
  telegramLink: stringSchema,
  linkedinLink: stringSchema,
  gitHubLink: stringSchema,
  email: requiredStringSchema,
});

const BioModel = mongoose.model<Bio>("bio", BioSchema);

export default BioModel;
