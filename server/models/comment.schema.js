import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model("Comment", CommentSchema);
