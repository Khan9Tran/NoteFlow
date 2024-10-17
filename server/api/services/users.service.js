import { User } from "../../models/user.schema.js";
import { Workspace } from "../../models/workspace.schema.js";
import { Page } from "../../models/page.schema.js";
import { EmailInUseError } from "../../errors/userError.js";
import _ from "lodash";
import { hashPassword } from "../../security/bcryptPassword.js";
import { created } from "../helpers/http.js";
import mongoose from "mongoose";
import logger from "../../common/logger.js";
import { createFirstPage } from "./pages.service.js";
import { createFirstWorkspace } from "./workspaces.service.js";

// Hàm tạo người dùng
const createUser = async (userData) => {
  const newUser = new User();
  newUser._id = new mongoose.Types.ObjectId();
  Object.assign(newUser, _.pick(userData, ["name", "email"]));
  newUser.password = await hashPassword(userData.password);
  await newUser.save();
  logger.info("User created: " + newUser._id);
  return newUser;
};

const create = async (userData) => {
  try {
    let existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new EmailInUseError();
    }

    const newUser = await createUser(userData);
    const workspaceResult = await createFirstWorkspace(
      newUser._id,
      newUser.name
    );

    newUser.workspaces.push(workspaceResult._id);
    await newUser.save();

    await createFirstPage(workspaceResult._id);

    const userWithoutPassword = _.omit(newUser.toObject(), ["password"]);
    return created(userWithoutPassword);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export { create };
