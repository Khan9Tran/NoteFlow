import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { create, getUserById } from "../../services/users.service.js";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  return create(req.body);
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  res.status(200).json({ message: "Đăng nhập thành công" });
});

const getUserInfo = asyncErrorHandler(async (req, res, next) => {
  return getUserById(req.params.id);
});

export { registerUser, loginUser, getUserInfo};
