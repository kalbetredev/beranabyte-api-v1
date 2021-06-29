import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

export interface Config extends Document {
  kex: string;
  value: string;
}

const ConfigSchema = new Schema({
  key: { ...requiredStringSchema, unique: true, dropDups: true },
  value: requiredStringSchema,
});

const ConfigModel = mongoose.model("config", ConfigSchema);

export default ConfigModel;
