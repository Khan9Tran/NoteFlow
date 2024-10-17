import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { created, noContent } from "../../helpers/http.js";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  return noContent();
});

export { registerUser };
