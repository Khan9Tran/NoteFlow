import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { login } from "../../services/auths.service.js";

const loginUser = asyncErrorHandler(async (req, res, next) => {
  return login(req.body);
});

export { loginUser };
