import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { getUserById, removeWorkspace, update } from "../../services/users.service.js";

const getUserInfo = asyncErrorHandler(async (req, res, next) => {
  return getUserById(req.params.id);
});

const addWorkspaceByUserId = asyncErrorHandler(async (req, res, next) => {
  return addWorkspace(req.params.id, req.body, req.user);
});

//Xoá workspace của một user
// check owner
const removeWorkspaceByUserId = asyncErrorHandler(async (req, res, next) => {
  return removeWorkspace(req.user, req.params.workspaceId);
  //req: userId, workspaceId
  //res: noContent
});

//Lấy thông tin tất cả workspace của một user
const getWorkspaceAccess = asyncErrorHandler(async (req, res, next) => {
  return getWorkspaceAccess(req.user);
});

//Patch user info
const updateUser = asyncErrorHandler(async (req, res, next) => {
  return update(req.user, req.body);
});

//Patch profile picture
const updateUserProfilePicture = asyncErrorHandler(async (req, res, next) => {
  return;
  //req: image
  //res: noContent
});

//Delete user
const deleteUser = asyncErrorHandler(async (req, res, next) => {
  return;
  //req: userId
  //res: noContent
});

export {
  getUserInfo,
  addWorkspaceByUserId,
  removeWorkspaceByUserId,
  getWorkspaceAccess,
  updateUser,
  updateUserProfilePicture,
  deleteUser,
};
