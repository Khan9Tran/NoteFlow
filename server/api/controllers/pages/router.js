import * as express from "express";
import {
  createPage,
  deletePage,
  deletePageByWorkspace,
  getAllTasks,
  getPageById,
  getPageContent,
  updatePageContent,
  updatePageTitle,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createNewPageRequest } from "../../validators/page/createNewPageRequest.js";

export default express
  .Router()
  .get("/:pageId", getPageById)
  .get("/:pageId/content", getPageContent)
  .get("/:pageId/tasks", getAllTasks)
  .post("/", validate(createNewPageRequest), createPage)
  .patch("/:pageId/content", updatePageContent)
  .patch("/:pageId/title", updatePageTitle)
  .delete("/:pageId", deletePage)
  .delete("/all/:workspaceId", deletePageByWorkspace);
