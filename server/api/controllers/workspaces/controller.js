import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import {
  addMember,
  create,
  deleteworkspace,
  getWbById,
  addPagetoWb,
  removeMemberFromWb,
  updateUserAccess,
  getWorkspaces,
} from "../../services/workspaces.service.js";


const getAllWorkSpace = asyncErrorHandler(async (req, res, next) => {
  return getWorkspaces(req.query, next);
});

const createWorkspace = asyncErrorHandler(async (req, res, next) => {
  return create(req.body, req.user);
});

const addMemberToWorkspace = asyncErrorHandler(async (req, res, next) => {
  return addMember(req.body, req.params.workspaceId, next);
  // request: name workspace từ req, userId từ token
  //response: create -> {name workspace, list member}
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


const removeMemberFromWorkspace = asyncErrorHandler(async (req, res, next) => {
  return removeMemberFromWb(req.params.workspaceId, req.params.memberId, next);
});

const updateUserRole = asyncErrorHandler(async (req, res, next) => {
  return updateUserAccess(req, res, next);
});

export {
  createWorkspace,
  getAllWorkSpace,
  addMemberToWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  addPageToWorkspace,
  updateWorkspace,
  updateUserRole,
  removeMemberFromWorkspace,
};
