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

  return created(await task.save());
};

export const getTaskById = async (req, res, next) => {
  const id = req.params.taskId;

  const task = await validateTaskAccess(await Task.findById(id), req, next);

  return ok(task);
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

  // Kiểm tra quyền truy cập vào Workspace
  const userInWorkspace = workspace.members.find(
    (member) => member.userId.toString() === req.user._id.toString()
  );
  if (!userInWorkspace) {
    return next(
      new ForbiddenError("You are not allowed to access this workspace")
    );
  }

  const comment = await Comment.findById(commentId);
  if (!comment || comment.taskId.toString() !== taskId) {
    return next(
      new ForbiddenError("Comment not found or does not belong to this task")
    );
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return next(
      new ForbiddenError("You are not allowed to update this comment")
    );
  }

  comment.text = req.body.text;
  await comment.save();

  return ok(await task.save());
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

  await Comment.findByIdAndDelete(commentId);

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
    return next(ForbiddenError("You are not allowed to access this task"));
  }

  const workspace = await Workspace.findById(page.workspaceId);
  if (!workspace) {
    return next(ForbiddenError("You are not allowed to access this task"));
  }

  if (!req.user.workspaces.includes(workspace._id)) {
    return next(ForbiddenError("You are not allowed to access this task"));
  }

  return task;
};
