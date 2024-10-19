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
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { userUpdateRequest } from "../../validators/user/updateUserRequest.js";
import { addWorkspaceByUserIdRequest } from "../../validators/user/addWorkspaceByUserIdRequest.js";

export default express
  .Router()
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
  .delete("/:id", deleteUser);
