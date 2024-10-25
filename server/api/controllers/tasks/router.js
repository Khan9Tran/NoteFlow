import * as express from "express";
import {
    addComment,
  createTask,
  deleteComment,
  deleteTask,
  getTaskById,
  updateComment,
  updateTask,
  updateTaskStatus,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createTaskRequest } from "../../validators/task/createTaskRequest.js";

export default express
  .Router()
  .get("/:taskId", getTaskById)
  .post("/", validate(createTaskRequest),createTask)
  .patch("/:taskId", updateTask)
  .patch("/:taskId/status", updateTaskStatus)
  .delete("/:taskId", deleteTask)
  .post("/:taskId/comments", addComment)
  .patch("/:taskId/comments/:commentId", updateComment)
  .delete("/:taskId/comments/:commentId", deleteComment);
