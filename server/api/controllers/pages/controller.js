import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import {
  createNewPage,
  getById,
  getPageContentById,
  updateTitle,
  deletePageById,
  deletePageByWorkspaceId,
  updatePageContentById,
  getAllTasksByPageId,
  getPages
} from "../../services/pages.service.js";

//check user has workspace access
const getPageById = asyncErrorHandler(async (req, res, next) => {
  return getById(req, res, next);
});

//check user has workspace access
const getPageContent = asyncErrorHandler(async (req, res, next) => {
  return getPageContentById(req, res, next);
});

//check user has workspace access
const createPage = asyncErrorHandler(async (req, res, next) => {
  return createNewPage(req.body, req.user, next);
});

//check user has workspace access
const updatePageContent = asyncErrorHandler(async (req, res, next) => {
  return updatePageContentById(req, res, next);
});

//check user has workspace access
const updatePageTitle = asyncErrorHandler(async (req, res, next) => {
  return updateTitle(req, res, next);
});

//check admin or owner of the workspace
const deletePage = asyncErrorHandler(async (req, res, next) => {
  return deletePageById(req, res, next);
});

//check admin or owner of the workspace
const deletePageByWorkspace = asyncErrorHandler(async (req, res, next) => {
  return deletePageByWorkspaceId(req, res, next);
});

//check user has workspace access
const getAllTasks = asyncErrorHandler(async (req, res, next) => {
  return getAllTasksByPageId(req, res, next);
});

const getAllPages = asyncErrorHandler(async (req, res, next) => {
  return getPages(req, res, next);
});

export {
  getPageById,
  getPageContent,
  updatePageContent,
  updatePageTitle,
  deletePage,
  deletePageByWorkspace,
  getAllTasks,
  createPage,
  getAllPages,
};
