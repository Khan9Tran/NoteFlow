import { UnauthorizedError } from "../../errors/authError.js";

const ownershipMiddleware = (req, res, next) => {
  const userId = req.params.id;
  const authenticatedUserId = req.user._id.toString();

  if (userId !== authenticatedUserId) {
    throw new UnauthorizedError(
      "You are not authorized to perform this action"
    );
  }
  next();
};

export default ownershipMiddleware;
