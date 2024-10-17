import mongoose from "mongoose";
import { Schema } from "mongoose";


const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  password: { type: String },
  profilePicture: { type: String , required: true},
  workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", UserSchema);
