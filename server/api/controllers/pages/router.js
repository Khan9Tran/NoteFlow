import * as express from "express";
import {
  createPage,
  deletePage,
  deletePageByWorkspace,
  getPageById,
  updatePage,
  getAllPages,
} from "./controller.js";
import validate from "../../middlewares/validate.js";
import { createNewPageRequest } from "../../validators/page/createNewPageRequest.js";

export default express
  .Router()
  .get("/:pageId", getPageById)
  .get("/", getAllPages)
  .post("/", validate(createNewPageRequest), createPage)
  .patch("/:pageId", updatePage)
  .delete("/:pageId", deletePage)
  .delete("/", deletePageByWorkspace);
