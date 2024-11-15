import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import {
  createNewTask,
  updateTaskById,
  deleteTaskById,
  getTasks
} from "../../services/tasks.service.js";
import { getTaskById as fetchTask } from "../../services/tasks.service.js";

const getTaskById = asyncErrorHandler(async (req, res, next) => {
  return fetchTask(req, res, next);

});

//check admin or owner of the workspace
const createTask = asyncErrorHandler(async (req, res, next) => {
  return createNewTask(req, res, next);
});

//check admin or owner of the workspace
const updateTask = asyncErrorHandler(async (req, res, next) => {
  return updateTaskById(req, res, next);
});


//check admin or owner of the workspace
const deleteTask = asyncErrorHandler(async (req, res, next) => {
  return deleteTaskById(req.params.taskId, req, next);
  // req: taskId
  // res: noContent
});

const getAllTasks = asyncErrorHandler(async (req, res, next) => {
  return getTasks(req, res, next);
});

export {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks
};
