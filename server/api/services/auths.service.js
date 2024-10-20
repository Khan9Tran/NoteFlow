import { verifyPassword } from "../../security/bcryptPassword.js";
import jwt from "jsonwebtoken";
import _ from "lodash";
import logger from "../../common/logger.js";
import { User } from "../../models/user.schema.js";
import { ok } from "../helpers/http.js";
import { UnauthorizedError } from "../../errors/authError.js";

const login = async (payload) => {
  try {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("tai khoan khong ton tai");
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("mat khau khong dung");
    }

    const token = jwt.sign(
      { sub: user.email, iss: "localhost:3000", scope: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    const userWithoutPassword = _.omit(user.toObject(), ["password"]);
    return ok({ token: token }, "login success");
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const introspect = async (decoded) => {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    console.log(currentTime);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new UnauthorizedError("Token has expired");
    }

    const user = await User.findOne({ email: decoded.sub });

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  } catch (error) {
    // throw new Error("error");
  }
};

export { login, introspect };
