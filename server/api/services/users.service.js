import { User } from "../../models/user.schema.js";
import l from "../../common/logger.js";
import { EmailInUseError } from "../../errors/userError.js";
import _ from 'lodash'
import { hashPassword } from "../../security/bcryptPassword.js";

const create = async (userData) => {
  l.info(`create account with: ${userData.email}`);

  
  const u = await User.findOne({ email: userData.email });
  if (u) {
    throw new EmailInUseError();
  }
  
  u =  _.pick(userData, ['name', 'email']);
  u.password = await hashPassword(userData.password)
  return await u.save();
}

export { create };
