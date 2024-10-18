import { User } from "../../models/user.schema.js";
import { EmailInUseError, UserNotFoundError } from "../../errors/userError.js";
import _ from "lodash";
import { hashPassword } from "../../security/bcryptPassword.js";
import { created, ok } from "../helpers/http.js";
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

    const firstPage = await createFirstPage(workspaceResult._id);

    workspaceResult.pages.push(firstPage._id);
    await workspaceResult.save();

    const userWithoutPassword = _.omit(newUser.toObject(), ["password"]);
    return created(userWithoutPassword, "Đăng ký thành công");
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const getUserById = async (userId) => {
  logger.info("Getting user info: " + userId);

  const user = await User.findById(userId)
    .select("-password") // Exclude the password from the response
    .populate({
      path: "workspaces",
      populate: {
        path: "pages", // Populate the pages within each workspace
        model: "Page",
        select: "-content",
      },
    });

  if (!user) {
    throw new UserNotFoundError();
  }

  return ok(user); // Return the user object without the password
};

const removeWorkspace = async (userId, workspaceId) => {
  
}

export { create, getUserById };
