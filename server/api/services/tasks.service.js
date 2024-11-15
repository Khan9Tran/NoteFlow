import logger from "../../common/logger.js";
import { ForbiddenError } from "../../errors/authError.js";
import { PageNotFoundError } from "../../errors/pageError.js";
import { TaskNotFoundError } from "../../errors/taskError.js";
import { WorkspaceNotFoundError } from "../../errors/workspaceError.js";
import { Page } from "../../models/page.schema.js";
import { Task } from "../../models/task.schema.js";
import { Workspace } from "../../models/workspace.schema.js";
import { Comment } from "../../models/comment.schema.js";
import { created, noContent, ok } from "../helpers/http.js";
import { query } from "express";

export const createNewTask = async (req, res, next) => {
  const task = new Task();
  Object.assign(task, req.body);

  const page = await Page.findById(task.pageId);

  if (!page) {
    return next(new PageNotFoundError("Page not found"));
  }

  if (!req.user.workspaces.includes(page.workspaceId)) {
    return next(new ForbiddenError("You are not allowed to access this page"));
  }

  const workspaces = await Workspace.findById(page.workspaceId);

  if (!workspaces) {
    return next(new WorkspaceNotFoundError("Workspace not found"));
  }

  logger.info("Creating task: " + task);
  if (task.assignee && !req.user.workspaces.includes(task.assignee)) {
    return next(new ForbiddenError("You are not allowed to assign this task"));
  }

  workspaces.members.forEach((member) => {
    if (member.userId.toString() === req.user._id.toString()) {
      if (member.role !== "admin") {
        return next(new ForbiddenError("You are not allowed to create task"));
      }
    }
  });

  await task.save();
  page.content.push({ taskId: task._id, type: "task" });
  await page.save();
  
  return created(task);
};

export const getTaskById = async (req, res, next) => {
  const id = req.params.taskId;

  const task = await validateTaskAccess(await Task.findById(id), req, next);

  return ok(task);
};

export const getCommentsByTaskId = async (req, taskId, next) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10; // Số lượng kết quả trên mỗi trang
  const page = parseInt(query.page) || 1; // Trang hiện tại
  const skip = (page - 1) * limit; // Bỏ qua kết quả (skip)

  // Tìm task theo taskId
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new TaskNotFoundError("Task not found"));
  }

  // Lấy các bình luận với phân trang
  const comments = task.comments.slice(skip, skip + limit);

  // Tính tổng số bình luận trong task
  const total = task.comments.length;

  // Tính tổng số trang
  const totalPages = Math.ceil(total / limit);

  // Xác định các giá trị hasPrevPage và hasNextPage
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  // Xác định trang tiếp theo và trang trước đó
  const prevPage = hasPrevPage ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;

  // Trả về dữ liệu cùng với thông tin phân trang
  return ok(comments, "Get comments", {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  });
};

export const updateTaskById = async (req, res, next) => {
  const task = await validateTaskAccess(
    await Task.findById(req.params.taskId),
    req,
    next
  );

  Object.assign(task, req.body);
  return ok(await task.save());
};

export const deleteTaskById = async (taskId, req, next) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new TaskNotFoundError("Task not found"));
  }

  const page = await Page.findById(task.pageId);
  if (!page) {
    return next(new PageNotFoundError("Page not found"));
  }

  const workspace = await Workspace.findById(page.workspaceId);
  if (!workspace) {
    return next(new WorkspaceNotFoundError("Workspace not found"));
  }

  const userInWorkspace = workspace.members.find(
    (member) => member.userId.toString() === req.user._id.toString()
  );

  if (!userInWorkspace || userInWorkspace.role !== "admin") {
    return next(new ForbiddenError("You are not allowed to delete this task"));
  }

  await Task.findByIdAndDelete(taskId);
  return noContent();
};

export const updateTaskStatusById = async (taskId, req, next) => {
  const task = await validateTaskAccess(await Task.findById(taskId), req, next);

  if (
    task.assignedTo &&
    !task.assignedTo.some((user) => user.toString() === req.user._id.toString())
  ) {
    return next(
      new ForbiddenError("You are not allowed to update this task status")
    );
  }

  task.status = req.body.status;
  return ok(await task.save());
};

export const addCommentToTask = async (taskId, req, next) => {
  const comment = req.body.text;

  const task = await Task.findById(taskId);
  if (!task) {
    return next(new TaskNotFoundError("Task not found"));
  }

  const page = await Page.findById(task.pageId);
  if (!page) {
    return next(new PageNotFoundError("Page not found"));
  }

  const workspace = await Workspace.findById(page.workspaceId);
  if (!workspace) {
    return next(new WorkspaceNotFoundError("Workspace not found"));
  }

  const userInWorkspace = workspace.members.find(
    (member) => member.userId.toString() === req.user._id.toString()
  );
  if (!userInWorkspace) {
    return next(
      new ForbiddenError("You are not allowed to access this workspace")
    );
  }

  // Thêm bình luận vào Task
  const newComment = new Comment({
    taskId: task._id,
    userId: req.user._id,
    text: comment,
    createdAt: new Date(),
  });
  await newComment.save();
  task.comments.push(newComment);

  return ok(await task.save());
};

export const updateCommentById = async (taskId, commentId, req, next) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new TaskNotFoundError("Task not found"));
  }

  const page = await Page.findById(task.pageId);
  if (!page) {
    return next(new PageNotFoundError("Page not found"));
  }

  const workspace = await Workspace.findById(page.workspaceId);
  if (!workspace) {
    return next(new WorkspaceNotFoundError("Workspace not found"));
  }

  const userInWorkspace = workspace.members.find(
    (member) => member.userId.toString() === req.user._id.toString()
  );
  if (!userInWorkspace) {
    return next(
      new ForbiddenError("You are not allowed to access this workspace")
    );
  }

  const commentIndex = task.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );

  if (commentIndex === -1) {
    return next(
      new ForbiddenError("Comment not found or does not belong to this task")
    );
  }

  const comment = task.comments[commentIndex];

  if (comment.userId.toString() !== req.user._id.toString()) {
    return next(
      new ForbiddenError("You are not allowed to update this comment")
    );
  }

  task.comments[commentIndex].text = req.body.text;
  task.updatedAt = Date.now();

  await task.save();

  return ok(task);
};

export const deleteCommentById = async (taskId, commentId, req, next) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new TaskNotFoundError("Task not found"));
  }

  const page = await Page.findById(task.pageId);
  if (!page) {
    return next(new PageNotFoundError("Page not found"));
  }

  const workspace = await Workspace.findById(page.workspaceId);
  if (!workspace) {
    return next(new WorkspaceNotFoundError("Workspace not found"));
  }

  const userInWorkspace = workspace.members.find(
    (member) => member.userId.toString() === req.user._id.toString()
  );
  console.log(userInWorkspace);

  if (
    !userInWorkspace ||
    (userInWorkspace.role !== "admin" &&
      workspace.owner.toString() !== req.user._id.toString())
  ) {
    return next(
      new ForbiddenError("You are not allowed to delete this comment")
    );
  }

  const comment = await Comment.findById(commentId);
  if (!comment || comment.taskId.toString() !== taskId) {
    return next(
      new ForbiddenError("Comment not found or does not belong to this task")
    );
  }

  // await Comment.findByIdAndDelete(commentId);

  task.comments = task.comments.filter((c) => c._id.toString() !== commentId);
  await task.save();

  return noContent();
};

const validateTaskAccess = async (task, req, next) => {
  if (!task) {
    return next(TaskNotFoundError());
  }

  const page = await Page.findById(task.pageId);
  if (!page) {
    return next(new ForbiddenError("You are not allowed to access this task"));
  }

  const workspace = await Workspace.findById(page.workspaceId);
  if (!workspace) {
    return next(new ForbiddenError("You are not allowed to access this task"));
  }

  if (!req.user.workspaces.includes(workspace._id)) {
    return next(new ForbiddenError("You are not allowed to access this task"));
  }

  return task;
};


export const getTasks= async (req, res, next) => {
  const id = req.query.pageId || null;
  const user = req.user;
  if (id === null) 
  {
    next(new PageNotFoundError("Page is required"));
  }

  const limit = parseInt(req.query.limit) || 10; // Số lượng task trên mỗi trang
  const page = parseInt(req.query.page) || 1; // Trang hiện tại
  const skip = (page - 1) * limit; // Tính số lượng task cần bỏ qua

  const pageDoc = await Page.findOne({ _id: id });

  if (!pageDoc) {
    next(new PageNotFoundError());
    return;
  }

  if (!user.workspaces.includes(pageDoc.workspaceId)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }


  const tasks = await Task.find({ pageId: id });

  const totalTasks = tasks.length;

  const totalPages = Math.ceil(totalTasks / limit);

  const paginatedTasks = tasks.slice(skip, skip + limit);

  const tasksDetails = await Promise.all(
    paginatedTasks.map((task) => Task.findOne({ _id: task.taskId }))
  );

  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const prevPage = hasPrevPage ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;

  return ok(tasksDetails, "Get tasks", {
    page,
    limit,
    totalTasks,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  });
};