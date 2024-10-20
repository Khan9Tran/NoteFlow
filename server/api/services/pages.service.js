import { ForbiddenError } from "../../errors/authError.js";
import { WorkspaceNotFoundError } from "../../errors/workspaceError.js";
import { Page } from "../../models/page.schema.js";
import { Workspace } from "../../models/workspace.schema.js";
import { created } from "../helpers/http.js";
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

const createNewPage = async (payload, user) => {
  const wsId = payload.workspaceId;
  const workspace = await Workspace.findById(wsId);
  if (!workspace) {
    throw new WorkspaceNotFoundError();
  }

  const admin = workspace.members.filter(
    (member) => member.userId === user.id && member.role === "admin"
  );

  if (admin.length === 0) {
    throw new ForbiddenError();
  }

  const newPage = new Page(payload);
  return created(await newPage.save());
};

export { createFirstPage, createNewPage };
