import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import {
  addMember,
  create,
  getallMembers,
  deleteworkspace,
  getWbById,
  getPages,
  addPagetoWb,
  removePageFromWb,
  removeMemberFromWb,
  updateUserAccess,
} from "../../services/workspaces.service.js";

const createWorkspace = asyncErrorHandler(async (req, res, next) => {
  return create(req.body, req.user);
  //return create trả về workspace id ở service, không dùng req (dùng user id từ token)
  //response: create -> workspace id
});

const addMemberToWorkspace = asyncErrorHandler(async (req, res, next) => {
  return addMember(req.body, req.params.workspaceId, next);
  // request: name workspace từ req, userId từ token
  //response: create -> {name workspace, list member}
});

const getAllMemberByWorkSpace = asyncErrorHandler(async (req, res, next) => {
  return getallMembers(req.params.workspaceId, next);
  // request: workspace id từ req
  //response: ok -> list member
});

const deleteWorkspace = asyncErrorHandler(async (req, res, next) => {
  return deleteworkspace(req.params.workspaceId, next);
  // request: workspace id từ req
  //response: noContent
});

const getWorkspaceById = asyncErrorHandler(async (req, res, next) => {
  return getWbById(req.params.workspaceId, next);
  // request: workspace id từ req
  //response: ok -> workspace
});

//All page cha từ workspace
const getAllPages = asyncErrorHandler(async (req, res, next) => {
  return getPages(req.params.workspaceId, next);
  // request: workspace id từ req
  //response: ok -> list root pages
});


//Them 1 page vao workspace
const addPageToWorkspace = asyncErrorHandler(async (req, res, next) => {
  return addPagetoWb(req.body, req.params.workspaceId, next);
  // request: page title va page refecence từ req, workspace id từ req
  //response: create -> page id
});

//Patch update workspace
const updateWorkspace = asyncErrorHandler(async (req, res, next) => {
  return;
  // request: workspace id từ req, cac truong muon update
  //response: ok -> workspace
});

const removePageFromWorkspace = asyncErrorHandler(async (req, res, next) => {
  return removePageFromWb(req.params.pageId, next);
  // request: page id từ req
  //response: noContent
});

const removeMemberFromWorkspace = asyncErrorHandler(async (req, res, next) => {
  return removeMemberFromWb(req.params.workspaceId, req.params.memberId, next);
  // request: member id từ req
  //response: noContent
});

const updateUserRole = asyncErrorHandler(async (req, res, next) => {
  return updateUserAccess(req, res, next);
});

export {
  createWorkspace,
  addMemberToWorkspace,
  getAllMemberByWorkSpace,
  deleteWorkspace,
  getWorkspaceById,
  getAllPages,
  addPageToWorkspace,
  updateWorkspace,
  updateUserRole,
  removePageFromWorkspace,
  removeMemberFromWorkspace,
};
