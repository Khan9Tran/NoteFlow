import * as express from "express";
import {
  addMemberToWorkspace,
  addPageToWorkspace,
  createWorkspace,
  deleteWorkspace,
  getAllPages,
  updateUserRole,
  getWorkspaceById,
  removeMemberFromWorkspace,
  removePageFromWorkspace,
  updateWorkspace,
  getAllWorkSpace,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createWorkspaceRequest } from "../../validators/workspace/createWorkspaceRquest.js";
import adminRoleMiddleware from "../../middlewares/adminRoleMiddleware.js";
export default express
  .Router()
  .get("/", adminRoleMiddleware, getAllWorkSpace)
  .get("/:workspaceId/pages", getAllPages)
  .get("/:workspaceId", getWorkspaceById)
  .post("/", validate(createWorkspaceRequest), createWorkspace)
  .post("/:workspaceId/members", addMemberToWorkspace)
  .post("/:workspaceId/members/:memberId", updateUserRole)
  .post("/:workspaceId/pages", addPageToWorkspace)
  .patch("/:workspaceId", updateWorkspace)
  .delete("/:workspaceId/members/:memberId", removeMemberFromWorkspace)
  .delete("/:workspaceId/pages/:pageId", removePageFromWorkspace)
  .delete("/:workspaceId", deleteWorkspace);
