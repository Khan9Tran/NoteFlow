import * as express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
  getAllTasks
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createTaskRequest } from "../../validators/task/createTaskRequest.js";
import { updateTaskRequest } from "../../validators/task/updateTaskRequest.js";
export default express
  .Router()
  .get("/:taskId", getTaskById)
  .get("/", getAllTasks)
  .post("/", validate(createTaskRequest), createTask)
  .patch("/:taskId", validate(updateTaskRequest), updateTask)
  .delete("/:taskId", deleteTask)
