import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import {
  createNewPage,
  getById,
  deletePageById,
  deletePageByWorkspaceId,
  updatePageById,
  getPages
} from "../../services/pages.service.js";

//check user has workspace access
const getPageById = asyncErrorHandler(async (req, res, next) => {
  return getById(req, res, next);
});


//check user has workspace access
const createPage = asyncErrorHandler(async (req, res, next) => {
  return createNewPage(req.body, req.user, next);
});

//check user has workspace access
const updatePage = asyncErrorHandler(async (req, res, next) => {
  return updatePageById(req, res, next);
});


//check admin or owner of the workspace
const deletePage = asyncErrorHandler(async (req, res, next) => {
  return deletePageById(req, res, next);
});

//check admin or owner of the workspace
const deletePageByWorkspace = asyncErrorHandler(async (req, res, next) => {
  return deletePageByWorkspaceId(req, res, next);
});

const getAllPages = asyncErrorHandler(async (req, res, next) => {
  return getPages(req, res, next);
});

export {
  getPageById,
  updatePage,
  deletePage,
  deletePageByWorkspace,
  createPage,
  getAllPages,
};
