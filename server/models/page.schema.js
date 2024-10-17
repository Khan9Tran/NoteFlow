import mongoose from "mongoose";
import { Schema } from "mongoose";


const PageSchema = new Schema({
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }, 
  title: { type: String, required: true },
  content: [{
    type: { type: String, enum: ['task', 'text'], required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    text: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Page = mongoose.model("Page", PageSchema);
