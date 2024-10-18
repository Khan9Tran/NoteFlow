import { Workspace } from "../../models/workspace.schema.js";
import { created } from "../helpers/http.js";

const createFirstWorkspace = async (userId, userName) => {
  const newWorkspace = new Workspace({
    name: `${userName}'s Workspace`,
    owner: userId,
    members: [{ userId: userId, role: "admin" }],
  });
  return await newWorkspace.save();
};


const create = async (payload, user) => {
  const newWorkspace = new Workspace({
    name: payload.name,
    owner: user._id,
    members: [{ userId: user._id, role: "admin" }],
  });

  const result = await newWorkspace.save();
  return created(result._id);
}

export { createFirstWorkspace, create };
