import AppError from "../utils/AppError.js";

class TaskNotFoundError extends AppError {
  constructor(message = "Task Not Found") {
    super(message, 404);
    this.name = "TaskNotFoundErrorr";
  }
}


export { TaskNotFoundError};
