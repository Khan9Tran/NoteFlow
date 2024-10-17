import { Page } from "../../models/page.schema.js";

const createFirstPage = async (workspaceId) => {
  const firstPage = new Page({
    workspaceId: workspaceId,
    title: "Welcome to Your Workspace",
    content: [
      {
        type: "text",
        text: "This is your first page! You can start adding tasks or notes here.",
      },
    ],
  });
  return await firstPage.save();
};

export { createFirstPage };
