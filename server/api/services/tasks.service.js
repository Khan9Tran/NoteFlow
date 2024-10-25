import logger from "../../common/logger";
import { ForbiddenError } from "../../errors/authError";
import { PageNotFoundError } from "../../errors/pageError";
import { Page } from "../../models/page.schema";
import { Task } from "../../models/task.schema";

export const createNewTask = async (req, res, next) => {
  const task = new Task();
  Object.assign(task, req.body);

  const page = Page.findById(task.pageId);

  if (!page) {
    return next(new PageNotFoundError("Page not found"));
  }

  if (!req.user.workspaces.includes(page.workspaceId)) {
    return next(new ForbiddenError("You are not allowed to access this page"));
  }

  workspaces = req.user.workspaces;
  logger.info("Creating task: " + workspaces);
  if (task.assignee && !req.user.workspaces.includes(task.assignee)) {
    return next(new ForbiddenError("You are not allowed to assign this task"));
  }
};
