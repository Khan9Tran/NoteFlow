import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { create, getUserById } from "../../services/users.service.js";
import { login } from "../../services/auths.service.js";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  return create(req.body);
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  return login(req.body);
});

const getUserInfo = asyncErrorHandler(async (req, res, next) => {
  return getUserById(req.params.id);
});

export { registerUser, loginUser, getUserInfo };
