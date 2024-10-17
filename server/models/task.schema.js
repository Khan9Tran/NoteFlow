import mongoose from "mongoose";
import { Schema } from "mongoose";


const TaskSchema = new Schema({
    pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true }, 
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['not_started', 'in_progress', 'done'], default: 'not_started' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    subtasks: [{
      title: { type: String },
      status: { type: String, enum: ['not_started', 'done'], default: 'not_started' }
    }],
    comments: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Task', TaskSchema);
  