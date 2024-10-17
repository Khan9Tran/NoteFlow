import { Workspace } from "../../models/workspace.schema.js";

const createFirstWorkspace = async (userId, userName) => {
  const newWorkspace = new Workspace({
    name: `${userName}'s Workspace`,
    owner: userId,
    members: [{ userId: userId, role: "admin" }],
  });
  return await newWorkspace.save();
};

export { createFirstWorkspace };
