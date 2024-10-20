import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { createNewPage } from "../../services/pages.service.js";

//check user has workspace access
const getPageById = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId
  // res: ok -> page
});

//check user has workspace access
const getPageContent = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId
  // res: ok -> page content
});

//check user has workspace access
const createPage = asyncErrorHandler(async (req, res, next) => {
  return createNewPage(req.body, req.user, next);
});


//check user has workspace access
const updatePageContent = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId, content
  // res: ok -> page
});


//check user has workspace access
const updatePageTitle = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId, title
  // res: ok -> page
});

//check admin or owner of the workspace
const deletePage = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId
  // res: noContent
});

//check admin or owner of the workspace
const deletePageByWorkspace = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: workspaceId
  // res: noContent
});

//check user has workspace access
const getAllTasks = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId
  // res: ok -> tasks
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
};
