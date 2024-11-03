import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import {
  createNewTask,
  updateTaskById,
  updateTaskStatusById,
  deleteTaskById,
  addCommentToTask,
  updateCommentById,
  deleteCommentById,
} from "../../services/tasks.service.js";
import { getTaskById as fetchTask } from "../../services/tasks.service.js";

const getTaskById = asyncErrorHandler(async (req, res, next) => {
  return fetchTask(req, res, next);

  // req: taskId
  // res: ok -> task
});

//check admin or owner of the workspace
const createTask = asyncErrorHandler(async (req, res, next) => {
  return createNewTask(req, res, next);
});

//check admin or owner of the workspace
const updateTask = asyncErrorHandler(async (req, res, next) => {
  return updateTaskById(req, res, next);
});

//check owner of the task
const updateTaskStatus = asyncErrorHandler(async (req, res, next) => {
  return updateTaskStatusById(req.params.taskId, req, next);
  // req: taskId, status
  // res: ok -> task
});

//check admin or owner of the workspace
const deleteTask = asyncErrorHandler(async (req, res, next) => {
  return deleteTaskById(req.params.taskId, req, next);
  // req: taskId
  // res: noContent
});

//check has workspace access
const addComment = asyncErrorHandler(async (req, res, next) => {
  return addCommentToTask(req.params.taskId, req, next);
  // req: taskId, comment
  // res: created -> comment
});

//check has workspace access
const updateComment = asyncErrorHandler(async (req, res, next) => {
  return updateCommentById(req.params.taskId, req.params.commentId, req, next);
  // req: taskId, commentId, comment
  // res: ok -> comment
});

//check admin or owner of the workspace
const deleteComment = asyncErrorHandler(async (req, res, next) => {
  return deleteCommentById(req.params.taskId, req.params.commentId, req, next);
  // req: taskId, commentId
  // res: noContent
});

export {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  updateComment,
  deleteComment,
  updateTaskStatus,
};
