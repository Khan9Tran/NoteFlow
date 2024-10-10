import { User } from "../../models/user.schema";
import l from "../../common/logger";
import AppError from "../../utils/AppError";

const create = async (userData) => {
  l.info(`create account with: ${userData.email}`);

  const u = await User.findOne({ email: userData.email });
  if (u) {
    throw new AppError("User already exists", 400);
  }

  const user = new User(userData);
  return await user.save();
}

export { create };
