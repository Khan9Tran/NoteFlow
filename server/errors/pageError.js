import AppError from "../utils/AppError.js";

class PageNotFoundError extends AppError {
  constructor(message = "Page Not Found") {
    super(message, 404);
    this.name = "PageNotFoundErrorr";
  }
}

export { PageNotFoundError };
