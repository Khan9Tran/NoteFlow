import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { create } from "../../services/users.service.js";
import { created } from "../../helpers/http.js";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const result = await create(req.body);
  return created({ message: "Success", data: result });
});

export { registerUser };
