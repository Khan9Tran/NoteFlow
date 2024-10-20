import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { ok } from "../../helpers/http.js";
import {
  addMember,
  create,
  getallMembers,
  deleteworkspace,
  getWbById,
  getRootPages,
  addPagetoWb,
  removePageFromWb,
  removeMemberFromWb,
} from "../../services/workspaces.service.js";

const createWorkspace = asyncErrorHandler(async (req, res, next) => {
  return create(req.body, req.user);
  //return create trả về workspace id ở service, không dùng req (dùng user id từ token)
  //response: create -> workspace id
});

const addMemberToWorkspace = asyncErrorHandler(async (req, res, next) => {
  return addMember(req.body, req.params.workspaceId);
  // request: name workspace từ req, userId từ token
  //response: create -> {name workspace, list member}
});

const getAllMemberByWorkSpace = asyncErrorHandler(async (req, res, next) => {
  return getallMembers(req.params.workspaceId);
  // request: workspace id từ req
  //response: ok -> list member
});

const deleteWorkspace = asyncErrorHandler(async (req, res, next) => {
  return deleteworkspace(req.params.workspaceId);
  // request: workspace id từ req
  //response: noContent
});

const getWorkspaceById = asyncErrorHandler(async (req, res, next) => {
  return getWbById(req.params.workspaceId);
  // request: workspace id từ req
  //response: ok -> workspace
});

//All page cha từ workspace
const getAllRootPages = asyncErrorHandler(async (req, res, next) => {
  return getRootPages(req.params.workspaceId);
  // request: workspace id từ req
  //response: ok -> list root pages
});

const getChildrenPageByPageRefecence = asyncErrorHandler(
  async (req, res, next) => {}
);

//Them 1 page vao workspace
const addPageToWorkspace = asyncErrorHandler(async (req, res, next) => {
  return addPagetoWb(req.body, req.params.workspaceId);
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
  return removePageFromWb(req.params.pageId);
  // request: page id từ req
  //response: noContent
});

const removeMemberFromWorkspace = asyncErrorHandler(async (req, res, next) => {
  return removeMemberFromWb(req.params.workspaceId, req.params.memberId);
  // request: member id từ req
  //response: noContent
});

export {
  createWorkspace,
  addMemberToWorkspace,
  getAllMemberByWorkSpace,
  deleteWorkspace,
  getWorkspaceById,
  getAllRootPages,
  getChildrenPageByPageRefecence,
  addPageToWorkspace,
  updateWorkspace,
  removePageFromWorkspace,
  removeMemberFromWorkspace,
};
