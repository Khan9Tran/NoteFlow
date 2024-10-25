import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import {
  addWorkspace,
  getUserById,
  getUsers,
  getWorkspace,
  removeWorkspace,
  update,
  getUserAuth,
} from "../../services/users.service.js";

const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  return getUsers(req.query, next);
});

const getUserInfo = asyncErrorHandler(async (req, res, next) => {
  return getUserById(req.params.id, next);
});

const addWorkspaceByUserId = asyncErrorHandler(async (req, res, next) => {
  return addWorkspace(req.params.id, req.body, req.user, next);
});

//Xoá workspace của một user
// check owner
const removeWorkspaceByUserId = asyncErrorHandler(async (req, res, next) => {
  return removeWorkspace(req.user, req.params.workspaceId, next);
  //req: userId, workspaceId
  //res: noContent
});

//Lấy thông tin tất cả workspace của một user
const getWorkspaceAccess = asyncErrorHandler(async (req, res, next) => {
  return getWorkspace(req.user, next);
});

//Patch user info
const updateUser = asyncErrorHandler(async (req, res, next) => {
  return update(req.user, req.body, next);
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

const getUserByToken = asyncErrorHandler(async (req, res, next) => {
  return getUserAuth(req.user, next);
});

export {
  getUserInfo,
  addWorkspaceByUserId,
  removeWorkspaceByUserId,
  getWorkspaceAccess,
  updateUser,
  updateUserProfilePicture,
  deleteUser,
  getAllUsers,
  getUserByToken,
};
