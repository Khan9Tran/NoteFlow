import mongoose from "mongoose";
import { Schema } from "mongoose";


const PageSettingsSchema = new Schema({
  font: { type: String, required: true },
  smallText: { type: Boolean, required: true },
  fullWidth: { type: Boolean, required: true },
  lock: { type: Boolean, required: true }
});


const CoverPictureSchema = new Schema({
  url: { type: String, required: true },
  verticalPosition: { type: Number, required: true }
});


const ContentSchema = new Schema({
  type: { type: String, required: true },
  content: { type: Array, required: true } 
});


const PageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  reference: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  coverPicture: { type: CoverPictureSchema, required: true },
  content: { type: ContentSchema, required: true },
  favorite: [{ type: String }], // Array of strings for favorites
  pageSettings: { type: PageSettingsSchema, required: true },
  path: { type: String, default: null },
  workspaceId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Export the Page model
export const Page = mongoose.model("Page", PageSchema);
