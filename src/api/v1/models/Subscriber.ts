import mongoose, { Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";

export interface Subscriber extends Document {
  email: string;
  date: Date;
}

const SubscriberSchema = new Schema<Subscriber>({
  email: requiredStringSchema,
  date: { type: Date, required: true },
});

const SubscriberModel = mongoose.model("subscriber", SubscriberSchema);

export default SubscriberModel;
