import * as express from "express";
import {
    addComment,
  createTask,
  deleteComment,
  deleteTask,
  getTaskById,
  updateComment,
  updateTask,
} from "./controller.js";

export default express
  .Router()
  .get("/:taskId", getTaskById)
  .post("/", createTask)
  .patch("/:taskId", updateTask)
  .delete("/:taskId", deleteTask)
  .post("/:taskId/comments", addComment)
  .patch("/:taskId/comments/:commentId", updateComment)
  .delete("/:taskId/comments/:commentId", deleteComment);
