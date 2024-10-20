import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { login } from "../../services/auths.service.js";
import { create } from "../../services/users.service.js";

const loginUser = asyncErrorHandler(async (req, res, next) => {
  return login(req.body, next);
});

const registerUser = asyncErrorHandler(async (req, res, next) => {
  return create(req.body, next);
});

export { loginUser, registerUser };
