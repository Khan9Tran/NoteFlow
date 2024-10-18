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


export default express
  .Router()
  .get("/:workspaceId/members", getAllMemberByWorkSpace)
  .get("/:workspaceId/pages/root", getAllRootPages)
  .get("/:workspaceId/pages/:pageId/childrens", getChildrenPageByPageRefecence)
  .get("/:workspaceId", getWorkspaceById)
  .post("/", createWorkspace)
  .post("/:workspaceId/members", addMemberToWorkspace)
  .post("/:workspaceId/pages", addPageToWorkspace)
  .patch("/:workspaceId", updateWorkspace)
  .delete("/:workspaceId/members/:memberId", removeMemberFromWorkspace)
  .delete("/:workspaceId/pages/:pageId", removePageFromWorkspace)
  .delete("/:workspaceId", deleteWorkspace);
