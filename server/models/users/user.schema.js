import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true, required: true, trim: true },
});

export const User = mongoose.model("User", userSchema);
