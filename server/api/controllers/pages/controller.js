import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { create } from "../../services/users.service.js";
import { created } from "../../helpers/http.js";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  create(req.body);
});

export { registerUser };
