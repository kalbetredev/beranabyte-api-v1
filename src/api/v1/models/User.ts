import { string } from "joi";
import mongoose, { Schema } from "mongoose";
import { requiredStringSchema } from "./CommonSchemas";
import { ADMIN_ROLE, NORMAL_ROLE, WRITER_ROLE } from "./UserRoles";

const UserSchema = new Schema({
  username: requiredStringSchema,
  email: requiredStringSchema,
  hash: requiredStringSchema,
  role: {
    type: String,
    required: true,
    enum: [NORMAL_ROLE, WRITER_ROLE, ADMIN_ROLE],
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
