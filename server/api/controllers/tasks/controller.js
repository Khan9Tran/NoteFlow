import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";

const getTaskById = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId
  // res: ok -> task
});

//check admin or owner of the workspace
const createTask = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: task
  // res: created -> task
});

//check admin or owner of the workspace
const updateTask = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId, task
  // res: ok -> task
});

//check owner of the task
const updateTaskStatus = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId, status
  // res: ok -> task
});

//check admin or owner of the workspace
const deleteTask = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId
  // res: noContent
});

//check has workspace access
const addComment = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId, comment
  // res: created -> comment
});

//check has workspace access
const updateComment = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId, commentId, comment
  // res: ok -> comment
});

//check admin or owner of the workspace
const deleteComment = asyncErrorHandler(async (req, res, next) => {
  return;
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
}