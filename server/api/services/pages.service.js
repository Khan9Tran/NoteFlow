import _ from "lodash";
import { WorkspaceNotFoundError } from "../../errors/workspaceError.js";
import { Page } from "../../models/page.schema.js";
import { Workspace } from "../../models/workspace.schema.js";
import { created, forbidden } from "../helpers/http.js";
import { ForbiddenError } from "../../errors/authError.js";
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

const createNewPage = async (payload, user, next) => {
  const wsId = _.get(payload, "workspaceId");
  const workspace = await Workspace.findOne({ _id: wsId });

  console.log("your id: " + user._id);
  console.log("workspace id: " + wsId);

  if (!workspace) {
    next(new WorkspaceNotFoundError());
  }

  workspace.members.forEach((member) => {
    console.log(member.userId.toString());
    console.log(member.role);
  });

  const admin = workspace.members.filter(
    (member) => member.userId.equals(user._id) && member.role === "admin"
  );

  if (admin.length === 0) {
    next(new ForbiddenError("You are not allowed to create a page"));
  }

  const newPage = new Page(payload);
  return created(await newPage.save());
};

export { createFirstPage, createNewPage };
