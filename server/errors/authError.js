import AppError from "../utils/AppError.js";

// Lỗi khi không xác thực
class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

// Lỗi khi không đủ quyền truy cập
class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export { UnauthorizedError, ForbiddenError };
