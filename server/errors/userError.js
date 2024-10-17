import AppError from "../utils/AppError";

// Lỗi khi email đã được sử dụng
class EmailInUseError extends AppError {
  constructor() {
    super("Email is already in use", 400);
    this.name = "EmailInUseError";
  }
}

// Lỗi khi không tìm thấy người dùng
class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404);
    this.name = "UserNotFoundError";
  }
}

// Lỗi yêu cầu không hợp lệ
class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export { EmailInUseError, UserNotFoundError, BadRequestError };
