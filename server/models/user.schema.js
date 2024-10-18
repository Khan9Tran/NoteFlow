import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  password: { type: String },
  profilePicture: { type: String },
  workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
});

export const User = mongoose.model("User", UserSchema);
