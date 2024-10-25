import { Workspace } from "../../models/workspace.schema.js";
import { Page } from "../../models/page.schema.js";
import { created, noContent, ok } from "../helpers/http.js";
import { User } from "../../models/user.schema.js";
import { WorkspaceNotFoundError } from "../../errors/workspaceError.js";
import { UserIsExistError, UserNotFoundError } from "../../errors/userError.js";
import { PageNotFoundError } from "../../errors/pageError.js";
const createFirstWorkspace = async (userId, userName) => {
  const newWorkspace = new Workspace({
    name: `${userName}'s Workspace`,
    owner: userId,
    members: [{ userId: userId, role: "admin" }],
  });
  return await newWorkspace.save();
};

const create = async (payload, user) => {
  const newWorkspace = new Workspace({
    name: payload.name,
    owner: user._id,
    members: [{ userId: user._id, role: "admin" }],
  });

  const result = await newWorkspace.save();
  return created({ _id: result._id });
};

const addMember = async (payload, workspaceId, next) => {
  const user = await User.findOne({ _id: payload._id });

  if (!user) {
    next(new UserNotFoundError());
    return;
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }

  const memberExists = workspace.members.some((member) =>
    member.userId.equals(user._id)
  );
  if (memberExists) {
    next(new UserIsExistError());
    return;
  }

  workspace.members.push({ userId: user._id, role: "member" });
  await workspace.save();

  return ok({
    name: workspace.name,
    members: workspace.members,
  });
};

const getallMembers = async (workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId).populate(
    "members.userId",
    "name email"
  );
  if (!workspace) {
    next(WorkspaceNotFoundError());
    return;
  }
  return ok(workspace.members);
};

const deleteworkspace = async (workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(WorkspaceNotFoundError());
    return;
  }
  await Workspace.deleteOne({ _id: workspaceId });
  return ok(noContent(), "delete success");
};

const getWbById = async (workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(WorkspaceNotFoundError());
    return;
  }
  return ok(workspace);
};

const getRootPages = async (workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId).populate(
    "pages",
    "title"
  );
  if (!workspace) {
    next(WorkspaceNotFoundError());
    return;
  }
  return ok(workspace.pages);
};

const addPagetoWb = async (payload, workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(WorkspaceNotFoundError());
    return;
  }
  const newPage = new Page({
    title: payload.title,
    reference: payload.reference,
    workspaceId: workspaceId,
  });
  await newPage.save();

  workspace.pages.push(newPage._id);
  await workspace.save();

  return created(newPage._id);
};

const updateWorkspace = async (workspaceId, updateFields, next) => {
  const workspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    updateFields,
    { new: true }
  );
  if (!workspace) {
    next(WorkspaceNotFoundError());
    return;
  }
  return ok(workspace);
};

const removePageFromWb = async (pageId, next) => {
  const page = await Page.findByIdAndDelete(pageId);
  if (!page) {
    next(PageNotFoundError());
    return;
  }
  return ok(noContent(), "delete success");
};

const removeMemberFromWb = async (workspaceId, memberId, next) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(WorkspaceNotFoundError());
    return;
  }

  workspace.members = workspace.members.filter(
    (member) => member.userId.toString() !== memberId
  );
  await workspace.save();

  return ok(noContent(), "delete success");
};

export {
  createFirstWorkspace,
  create,
  addMember,
  getallMembers,
  deleteworkspace,
  getWbById,
  getRootPages,
  addPagetoWb,
  removePageFromWb,
  removeMemberFromWb,
};
