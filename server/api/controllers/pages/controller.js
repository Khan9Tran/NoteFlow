import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";

const getPageById = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId
  // res: ok -> page
});

const getPageContent = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId
  // res: ok -> page content
});

const createPage = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: page
  // res: created -> page
});

const updatePageContent = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId, content
  // res: ok -> page
});

const updatePageTitle = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId, title
  // res: ok -> page
});

const deletePage = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: pageId
  // res: noContent
});

const deletePageByWorkspace = asyncErrorHandler(async (req, res, next) => {
  return;
  // req: workspaceId
  // res: noContent
});

export {
  getPageById,
  getPageContent,
  createPage,
  updatePageContent,
  updatePageTitle,
  deletePage,
  deletePageByWorkspace,
};
