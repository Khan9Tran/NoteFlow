import AppError from "../utils/AppError.js";

class WorkspaceNotFoundError extends AppError {
  constructor(message = "Workspace Not Found Error") {
    super(message, 404);
    this.name = "WorkspaceNotFoundError";
  }
}

class WorkspaceHasBeenAddedError extends AppError {
  constructor(message = "Workspace Has Been Added Error") {
    super(message, 400);
    this.name = "WorkspaceHasBeenAddedError";
  }
}

export { WorkspaceNotFoundError, WorkspaceHasBeenAddedError };
