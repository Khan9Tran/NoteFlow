import mongoose from "mongoose";
import { Schema } from "mongoose";

const WorkspaceSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["admin", "member"], required: true },
    },
  ],
  pages: [{ type: Schema.Types.ObjectId, ref: "Page" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Workspace = mongoose.model("Workspace", WorkspaceSchema);
