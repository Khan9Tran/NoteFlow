import { createUser } from "../../models/users/user.class";
import { User } from "../../models/users/user.schema";
import l from "../../common/logger";

async function create(userData) {
  l.info(`create`);
  try {
    const user = new User(userData);
    const savedUser = await createUser(user);
    return { status: 201, data: savedUser }; 
  } catch (error) {
    throw error;
  }
}

export { create };
