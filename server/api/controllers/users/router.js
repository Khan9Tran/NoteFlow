import * as express from "express";
import ownershipMiddleware from "../../middlewares/ownershipMiddleware.js";
import {
  getUserInfo,
  addWorkspaceByUserId,
  getWorkspaceAccess,
  deleteUser,
  updateUser,
  updateUserProfilePicture,
  removeWorkspaceByUserId,
  getAllUsers,
  getUserByToken,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { userUpdateRequest } from "../../validators/user/updateUserRequest.js";
import { addWorkspaceByUserIdRequest } from "../../validators/user/addWorkspaceByUserIdRequest.js";
import adminRoleMiddleware from "../../middlewares/adminRoleMiddleware.js";

export default express
  .Router()
  .get("/", adminRoleMiddleware, getAllUsers)
  .get("/me", getUserByToken)
  .get("/:id", ownershipMiddleware, getUserInfo)
  .get("/:id/workspaces-access", ownershipMiddleware, getWorkspaceAccess)
  .post(
    "/:id/workspaces-access",
    validate(addWorkspaceByUserIdRequest),
    addWorkspaceByUserId
  )
  .patch("/:id", validate(userUpdateRequest), updateUser)
  .patch("/:id/profile-picture", updateUserProfilePicture)
  .delete(
    "/:id/workspaces-access/:workspaceId",
    ownershipMiddleware,
    removeWorkspaceByUserId
  )
  .delete("/:id", ownershipMiddleware, deleteUser);
