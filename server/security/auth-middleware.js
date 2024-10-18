import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/authError.js";
import logger from "../common/logger.js";
import { introspect } from "../api/services/auths.service.js";

const authMiddleware = async (req, res, next) => {
  var authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized, token not provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Unauthorized, token not provided");
  }

  try {
    console.log(token);
    // Kiểm tra tính hợp lệ của token
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = await introspect(decoded);

    next();
  } catch (error) {
    throw new UnauthorizedError("invalid token");
  }
};

export default authMiddleware;
