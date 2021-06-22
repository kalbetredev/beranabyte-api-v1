import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: String,
  email: String,
  hash: String,
});

const User = mongoose.model("user", UserSchema);

export default User;
