import mongoose from "mongoose";
import { Schema } from "mongoose";



const ProfilePictureSchema = new Schema({
  url: { type: String, required: true }
});

const WorkspaceSchema = new Schema({
  workspaceId: { type: String, required: true },
  workspaceName: { type: String, required: true },
  workspaceIcon: { type: String, required: true },
  favorites: [{ type: String }]
});

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDarkMode: { type: Boolean, default: false },
  profilePicture: { type: ProfilePictureSchema, required: true },
  workspaces: [WorkspaceSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export const User = mongoose.model("User", UserSchema);
