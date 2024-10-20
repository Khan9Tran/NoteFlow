import mongoose from "mongoose";
import { UnauthorizedError } from "../../errors/authError.js";
import { Workspace } from "../../models/workspace.schema.js";
import { created, ok } from "../helpers/http.js";
import { User } from "../../models/user.schema.js";

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
  return created(result._id);
};

const addMember = async (payload, workspaceId) => {
  const user = await User.findOne({ _id: payload._id });
  console.log(user);
  if (!user) {
    console.log("k có");
  }
  console.log(workspaceId);
  // const objectId = new mongoose.Types.ObjectId(workspaceId);
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    console.log("k có");
  }

  const memberExists = workspace.members.some((member) =>
    member.userId.equals(user._id)
  );
  if (memberExists) {
    return { error: "User is already a member of this workspace." };
  }

  workspace.members.push({ userId: user._id, role: "member" });
  await workspace.save();

  return ok({
    name: workspace.name,
    members: workspace.members,
  });
};

const getAllMembersByWorkspace = async (workspaceId) => {
  const workspace = await Workspace.findById(workspaceId).populate(
    "members.userId",
    "name email"
  );
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }
  return ok(workspace.members);
};

const deleteWorkspace = async (workspaceId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }
  await workspace.remove();
  return noContent();
};

const getWorkspaceById = async (workspaceId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }
  return ok(workspace);
};

// Lấy tất cả trang gốc (root pages) trong workspace
const getAllRootPages = async (workspaceId) => {
  const workspace = await Workspace.findById(workspaceId).populate(
    "pages",
    "title"
  );
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }
  return ok(workspace.pages);
};

const getChildrenPageByPageReference = async (pageId) => {
  const page = await Page.findById(pageId).populate("childrens", "title");
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  return ok(page.childrens);
};

const addPageToWorkspace = async (payload, workspaceId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }
  const newPage = new Page({
    title: payload.title,
    reference: payload.reference,
  });
  await newPage.save();

  workspace.pages.push(newPage._id);
  await workspace.save();

  return created(newPage._id);
};

const updateWorkspace = async (workspaceId, updateFields) => {
  const workspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    updateFields,
    { new: true }
  );
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }
  return ok(workspace);
};

const removePageFromWorkspace = async (pageId) => {
  const page = await Page.findByIdAndRemove(pageId);
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  return noContent();
};

const removeMemberFromWorkspace = async (workspaceId, memberId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  workspace.members = workspace.members.filter(
    (member) => member.userId.toString() !== memberId
  );
  await workspace.save();

  return noContent();
};

export { createFirstWorkspace, create, addMember };
