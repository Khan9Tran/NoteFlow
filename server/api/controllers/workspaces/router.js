import * as express from "express";
import {
  addMemberToWorkspace,
  addPageToWorkspace,
  createWorkspace,
  deleteWorkspace,
  getAllMemberByWorkSpace,
  getAllRootPages,
  getChildrenPageByPageRefecence,
  getWorkspaceById,
  removeMemberFromWorkspace,
  removePageFromWorkspace,
  updateWorkspace,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createWorkspaceRequest } from "../../validators/workspace/createWorkspaceRquest.js";

export default express
  .Router()
  .get("/:workspaceId/members", getAllMemberByWorkSpace)
  .get("/:workspaceId/pages", getAllRootPages)
  .get("/:workspaceId", getWorkspaceById)
  .post("/", validate(createWorkspaceRequest), createWorkspace)
  .post("/:workspaceId/members", addMemberToWorkspace)
  .post("/:workspaceId/pages", addPageToWorkspace)
  .patch("/:workspaceId", updateWorkspace)
  .delete("/:workspaceId/members/:memberId", removeMemberFromWorkspace)
  .delete("/:workspaceId/pages/:pageId", removePageFromWorkspace)
  .delete("/:workspaceId", deleteWorkspace);
