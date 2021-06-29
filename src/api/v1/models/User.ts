import mongoose, { Document, Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";
import { ADMIN_ROLE, NORMAL_ROLE, WRITER_ROLE } from "./UserRoles";

export interface User extends Document {
  username: string;
  email: string;
  hash: string;
  role: string;
}

const UserSchema = new Schema<User>({
  username: requiredStringSchema,
  email: requiredStringSchema,
  hash: requiredStringSchema,
  role: {
    type: String,
    required: true,
    enum: [NORMAL_ROLE, WRITER_ROLE, ADMIN_ROLE],
  },
});

const UserModel = mongoose.model<User>("user", UserSchema);

export default UserModel;
