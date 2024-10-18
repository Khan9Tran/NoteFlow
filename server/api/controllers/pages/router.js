import * as express from "express";
import {
  createPage,
  deletePage,
  deletePageByWorkspace,
  getPageById,
  getPageContent,
  updatePageContent,
  updatePageTitle,
} from "./controller.js";

export default express
  .Router()
  .get("/:pageId", getPageById)
  .get("/:pageId/content", getPageContent)
  .post("/", createPage)
  .patch("/:pageId/content", updatePageContent)
  .patch("/:pageId/title", updatePageTitle)
  .delete("/:pageId", deletePage)
  .delete("/all/:workspaceId", deletePageByWorkspace);
