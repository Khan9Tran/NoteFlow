import { EmailInUseError } from "../../../errors/userError";
import asyncErrorHandler from "../../../utils/asyncErrorHandler";
import { created, noContent } from "../../helpers/http";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  return noContent();
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  

  res.status(200).json({ message: 'Đăng nhập thành công' });
});

export { registerUser, loginUser };
