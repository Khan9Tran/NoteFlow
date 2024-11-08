import * as express from "express";
import {
  createPage,
  deletePage,
  deletePageByWorkspace,
  getPageById,
  updatePageContent,
  updatePageTitle,
  getAllPages,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createNewPageRequest } from "../../validators/page/createNewPageRequest.js";
import { updateTitleRequest } from "../../validators/page/updateTitleRequest.js";

export default express
  .Router()
  .get("/:pageId", getPageById)
  .get("", getAllPages)
  .post("/", validate(createNewPageRequest), createPage)
  .patch("/:pageId/content", updatePageContent)
  .patch("/:pageId/title", validate(updateTitleRequest), updatePageTitle)
  .delete("/:pageId", deletePage)
  .delete("/", deletePageByWorkspace);
