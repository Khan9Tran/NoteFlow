import * as express from "express";
import ownershipMiddleware from "../../middlewares/ownershipMiddleware.js";
import {
  registerUser,
  loginUser,
  getUserInfo,
  addWorkspaceByUserId,
  getWorkspaceAccess,
  deleteUser,
  updateUser,
  updateUserProfilePicture,
  removeWorkspaceByUserId,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { userRegisterRequest } from "../../validators/user/registerRequest.js";
import { userLoginRequest } from "../../validators/user/loginRequest.js";

export default express
  .Router()
  .post("/", validate(userRegisterRequest), registerUser)
  .post("/login", validate(userLoginRequest), loginUser)
  .get("/:id", getUserInfo)
  .get("/:id/workspaces-access", getWorkspaceAccess)
  .post(":id/workspaces-access", addWorkspaceByUserId)
  .patch("/:id", updateUser)
  .patch("/:id/profile-picture", updateUserProfilePicture)
  .delete("/:id/workspaces-access/:workspaceId", ownershipMiddleware,removeWorkspaceByUserId)
  .delete("/:id", deleteUser);
