import { UnauthorizedError } from "../../errors/authError.js";

const adminRoleMiddleware = (req, res, next) => {
  const admin = req.user;

  if (!admin) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (!admin.role.includes("ADMIN")) {
    return next(
      new UnauthorizedError("You are not authorized to perform this action")
    );
  }

  return next();
};

export default adminRoleMiddleware;
