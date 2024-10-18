import AppError from "../utils/AppError.js";

class WorkspaceNotFoundError extends AppError {
  constructor(message = "Workspace Not Found Error") {
    super(message, 404);
    this.name = "WorkspaceNotFoundError";
  }
}

export { WorkspaceNotFoundError };
