import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { create, getUserById } from "../../services/users.service.js";
import { login } from "../../services/auths.service.js";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  return create(req.body);
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  return login(req.body);
});


const getUserInfo = asyncErrorHandler(async (req, res, next) => {
  return getUserById(req.params.id);
});


//For func share link truy cập in FE
const addWorkspaceByUserId = asyncErrorHandler(async (req, res, next) => {
  return
  //req: userId, workspaceId
  //res: noContent
});

//Xoá workspace của một user
// check owner 
const removeWorkspaceByUserId = asyncErrorHandler(async (req, res, next) => {
  return;

  //req: userId, workspaceId
  //res: noContent
});


//Lấy thông tin tất cả workspace của một user
// check owner
const getWorkspaceAccess = asyncErrorHandler(async (req, res, next) => {
  return;
  // request userId
  // response ok -> all workspace of user
});


//Patch user info
const updateUser = asyncErrorHandler(async (req, res, next) => {
  return;
  //req: attribute need to update
  //res: ok -> updated user
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
  registerUser,
  loginUser,
  getUserInfo,
  addWorkspaceByUserId,
  removeWorkspaceByUserId,
  getWorkspaceAccess,
  updateUser,
  updateUserProfilePicture,
  deleteUser
};
