import { UnauthorizedError } from "../../errors/authError.js";

const ownershipMiddleware = (req, res, next) => {
  const userId = req.params.id.toString(); 
  const authenticatedUserId = req.user ? req.user._id.toString() : null;

  if (!authenticatedUserId) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (userId !== authenticatedUserId) {
    return next(
      new UnauthorizedError("You are not authorized to perform this action")
    );
  } else {
    return next();
  }
};

export default ownershipMiddleware;
