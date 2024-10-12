import mongoose from "mongoose";
import { Schema } from "mongoose";


const PageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  reference: { type: String, required: true },
  path: { type: String, default: null },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


const WorkspaceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  members: [{ type: String, required: true }], 
  pages: [PageSchema], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});


export const Workspace = mongoose.model("Workspace", WorkspaceSchema);
