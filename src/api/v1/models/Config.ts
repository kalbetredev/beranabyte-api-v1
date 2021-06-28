import mongoose, { Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

const ConfigSchema = new Schema({
  key: { ...requiredStringSchema, unique: true, dropDups: true },
  value: requiredStringSchema,
});

const Config = mongoose.model("config", ConfigSchema);

export default Config;
