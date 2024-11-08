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

  workspace.pages.pull({ _id: id });
  await workspace.save();
  await Page.deleteOne({ _id: id });

  return noContent();
};

const deletePageByWorkspaceId = async (req, res, next) => {
  const id = req.query.workspaceId || null;
  const user = req.user;

  if (id === null) {
    next(new WorkspaceNotFoundError("Workspace is required"));
    return;
  }

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

  workspace.pages = [];
  await workspace.save();
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

  // Lấy tham số phân trang từ query
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

  const content = pageDoc.content;

  if (content.length === 0) {
    return ok({ tasks: [], totalPages: 0, total: 0 });
  }

  const tasks = content.filter((item) => item.type === "task");

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
    total: totalTasks,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  });
};

const getPages = async (req, res, next) => {
  const workspaceId = req.query.workspaceId || null;

  if (workspaceId === null) {
    next(new WorkspaceNotFoundError("Workspace is required"));
    return;
  }

  const workspace = await Workspace.findById(workspaceId).populate(
    "pages",
    "title"
  );


  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }
  return ok(workspace.pages);
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
  getPages
};
