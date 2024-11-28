import * as express from "express";
import ownershipMiddleware from "../../middlewares/ownershipMiddleware.js";
import {
  getUserInfo,
  addWorkspaceByUserId,
  getWorkspaceAccess,
  deleteUser,
  updateUser,
  removeWorkspaceByUserId,
  getAllUsers,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { userUpdateRequest } from "../../validators/user/updateUserRequest.js";
import { addWorkspaceByUserIdRequest } from "../../validators/user/addWorkspaceByUserIdRequest.js";
import adminRoleMiddleware from "../../middlewares/adminRoleMiddleware.js";

export default express
  .Router()
  .get("/", adminRoleMiddleware, getAllUsers)
  .get("/:id", getUserInfo)
  .get("/:id/workspaces-access", ownershipMiddleware, getWorkspaceAccess)
  .post(
    "/:id/workspaces-access",
    validate(addWorkspaceByUserIdRequest),
    addWorkspaceByUserId
  )
  .patch("/:id", validate(userUpdateRequest), updateUser)
  .delete(
    "/:id/workspaces-access/:workspaceId",
    ownershipMiddleware,
    removeWorkspaceByUserId
  )
  .delete("/:id", ownershipMiddleware, deleteUser);
