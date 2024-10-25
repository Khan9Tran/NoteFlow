import _ from "lodash";
import { WorkspaceNotFoundError } from "../../errors/workspaceError.js";
import { Page } from "../../models/page.schema.js";
import { Workspace } from "../../models/workspace.schema.js";
import { created, forbidden, noContent, ok } from "../helpers/http.js";
import { ForbiddenError } from "../../errors/authError.js";
import { validateUpdateContent } from "../validators/page/updateContentRequest.js";
import { PageNotFoundError, ValidationError } from "../../errors/pageError.js";
import { Task } from "../../models/task.schema.js";
const createFirstPage = async (workspaceId) => {
  const firstPage = new Page({
    workspaceId: workspaceId,
    title: "Welcome to Your Workspace",
    content: [
      {
        type: "text",
        text: "This is your first page! You can start adding tasks or notes here.",
      },
    ],
  });
  return await firstPage.save();
};

const createNewPage = async (payload, user, next) => {
  const wsId = _.get(payload, "workspaceId");
  const workspace = await Workspace.findOne({ _id: wsId });

  console.log("your id: " + user._id);
  console.log("workspace id: " + wsId);

  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }

  workspace.members.forEach((member) => {
    console.log(member.userId.toString());
    console.log(member.role);
  });

  const admin = workspace.members.filter(
    (member) => member.userId.equals(user._id) && member.role === "admin"
  );

  if (admin.length === 0) {
    next(new ForbiddenError("You are not allowed to create a page"));
    return;
  }

  const newPage = new Page(payload);
  return created(await newPage.save());
};

const getById = async (req, res, next) => {
  const id = req.params.pageId;
  const user = req.user;

  //Không lấy content của page
  var page = await Page.findOne({ _id: id });

  if (!page) {
    next(new PageNotFoundError());
    return;
  }

  if (!user.workspaces.includes(page.workspaceId)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }

  page = _.omit(page.toObject(), ["content"]);

  return ok({ page: page });
};

const getPageContentById = async (req, res, next) => {
  const id = req.params.pageId;
  const user = req.user;
  const page = await Page.findOne({ _id: id });

  if (!page) {
    next(new PageNotFoundError());
    return;
  }

  if (!user.workspaces.includes(page.workspaceId)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }

  return ok({ content: page.content });
};

const updateTitle = async (req, res, next) => {
  const id = req.params.pageId;
  const payload = req.body;
  const user = req.user;

  const page = await Page.findOne({ _id: id });

  if (!user.workspaces.includes(page.workspaceId)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }

  if (!page) {
    next(new PageNotFoundError());
    return;
  }

  page.title = payload.title;

  await page.save();

  return ok({ page: _.omit(page.toObject(), ["content"]) });
};

const deletePageById = async (req, res, next) => {
  const id = req.params.pageId;
  const user = req.user;

  const page = await Page.findOne({ _id: id });

  if (!user.workspaces.includes(page.workspaceId)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }

  if (!page) {
    next(new PageNotFoundError());
    return;
  }

  const workspace = await Workspace.findOne({ _id: page.workspaceId });

  const admin = workspace.members.filter(
    (member) => member.userId.equals(user._id) && member.role === "admin"
  );

  if (admin.length === 0) {
    next(new ForbiddenError("You are not allowed to delete a page"));
    return;
  }

  await Page.deleteOne({ _id: id });

  return noContent();
};

const deletePageByWorkspaceId = async (req, res, next) => {
  const id = req.params.workspaceId;
  const user = req.user;

  if (!user.workspaces.includes(id)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }

  const workspace = await Workspace.findOne({ _id: id });

  const admin = workspace.members.filter(
    (member) => member.userId.equals(user._id) && member.role === "admin"
  );

  if (admin.length === 0) {
    next(new ForbiddenError("You are not allowed to delete a page"));
    return;
  }

  await Page.deleteMany({ workspaceId: id });

  return noContent();
};

const updatePageContentById = async (req, res, next) => {
  const { error } = validateUpdateContent(req.body);

  if (error) {
    next(new ValidationError(error.details));
    return;
  }

  const id = req.params.pageId;
  const user = req.user;

  const page = await Page.findOne({ _id: id });

  if (!page) {
    next(new PageNotFoundError());
    return;
  }

  if (!user.workspaces.includes(page.workspaceId)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }

  const workspace = await Workspace.findOne({ _id: page.workspaceId });

  const viewer = workspace.members.filter(
    (member) => member.userId.equals(user._id) && member.role === "viewer"
  );

  if (viewer.length > 0) {
    next(
      new ForbiddenError("You are not allowed to edit the content of this page")
    );
    return;
  }

  page.content = req.body.content;

  await page.save();

  return ok({ content: page.content });
};

const getAllTasksByPageId = async (req, res, next) => {
  const id = req.params.pageId;
  const user = req.user;

  const page = await Page.findOne({ _id: id });

  if (!page) {
    next(new PageNotFoundError());
    return;
  }

  if (!user.workspaces.includes(page.workspaceId)) {
    next(new ForbiddenError("You are not allowed to access this page"));
    return;
  }

  const content = page.content;

  if (content.length === 0) {
    return ok({ tasks: [] });
  }

  const tasks = content.filter((item) => item.type === "task");

  const tasksDetails = tasks.map((task) => {
    return Task.findOne({ _id: task.taskId });
  });

  return ok({ tasks: tasksDetails });
};
export {
  createFirstPage,
  createNewPage,
  getById,
  getPageContentById,
  updateTitle,
  deletePageById,
  deletePageByWorkspaceId,
  updatePageContentById,
  getAllTasksByPageId,
};
