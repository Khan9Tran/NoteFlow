import * as express from "express";
import {
  addComment,
  createTask,
  deleteComment,
  deleteTask,
  getTaskById,
  updateComment,
  updateTask,
  getAllTasks
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createTaskRequest } from "../../validators/task/createTaskRequest.js";
import { updateTaskRequest } from "../../validators/task/updateTaskRequest.js";
import { createCommentRequest } from "../../validators/comment/createCommentRequest.js";
import { updateCommentRequest } from "../../validators/comment/updateCommentRequest.js";
export default express
  .Router()
  .get("/:taskId", getTaskById)
  .get("/", getAllTasks)
  .post("/", validate(createTaskRequest), createTask)
  .patch("/:taskId", validate(updateTaskRequest), updateTask)
  .delete("/:taskId", deleteTask)
  .post("/:taskId/comments", validate(createCommentRequest), addComment)
  .patch(
    "/:taskId/comments/:commentId",
    validate(updateCommentRequest),
    updateComment
  )
  .delete("/:taskId/comments/:commentId", deleteComment);
