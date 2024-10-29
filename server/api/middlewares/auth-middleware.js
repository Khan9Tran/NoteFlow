import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../errors/authError.js";
import { introspect } from "../services/auths.service.js";

const authMiddleware = async (req, res, next) => {
  var authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthorizedError("Unauthorized, token not provided"));
  }
  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      next(new UnauthorizedError("Unauthorized, token not provided"));
    }

    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = await introspect(decoded);
    next();
  } catch (error) {
    next(new UnauthorizedError("Unauthorized, token not valid"));
  }
};

export default authMiddleware;
