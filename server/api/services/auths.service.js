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
      throw new UnauthorizedError("Email not exist");
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Password is incorrect");
    }

    const token = jwt.sign(
      {
        sub: user.email,
        iss: process.env.ISSUER,
        scope: user.role,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return ok({ token: token }, "Login success");
  } catch (error) {
    logger.error(error);
    throw new UnauthorizedError(error.message);
  }
};

const introspect = async (decoded) => {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new UnauthorizedError("Token has expired");
    }

    const user = await User.findOne({ email: decoded.sub });

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  } catch (error) {
    throw new UnauthorizedError(error.message);
  }
};

export { login, introspect };
