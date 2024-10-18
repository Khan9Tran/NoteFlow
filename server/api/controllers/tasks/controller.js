import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";

const getTaskById = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId
  // res: ok -> task
});

const createTask = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: task
  // res: created -> task
});

const updateTask = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId, task
  // res: ok -> task
});

const deleteTask = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId
  // res: noContent
});

const addComment = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId, comment
  // res: created -> comment
});

const updateComment = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: taskId, commentId, comment
  // res: ok -> comment
});

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
}