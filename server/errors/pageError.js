import AppError from "../utils/AppError.js";

class PageNotFoundError extends AppError {
  constructor(message = "Page Not Found") {
    super(message, 404);
    this.name = "PageNotFoundErrorr";
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation Error") {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export { PageNotFoundError , ValidationError };
