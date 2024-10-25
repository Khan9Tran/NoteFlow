import logger from "../../common/logger.js";
import { ForbiddenError } from "../../errors/authError.js";
import { PageNotFoundError } from "../../errors/pageError.js";
import { TaskNotFoundError } from "../../errors/taskError.js";
import { WorkspaceNotFoundError } from "../../errors/workspaceError.js";
import { Page } from "../../models/page.schema.js";
import { Task } from "../../models/task.schema.js";
import { Workspace } from "../../models/workspace.schema.js";
import { created, ok } from "../helpers/http.js";

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
