import { UnauthorizedError } from "../../errors/authError.js";
import { Workspace } from "../../models/workspace.schema.js";
const workspaceOwnershipMiddleware = async (req, res, next) => {
  const workspaceId = req.params.workspaceId;
  const authenticatedUserId = req.user._id.toString();

  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return next(new UnauthorizedError("Workspace not found"));
    }

    if (workspace.owner.toString() !== authenticatedUserId) {
      return next(
        new UnauthorizedError("You are not authorized to access this workspace")
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default workspaceOwnershipMiddleware;
