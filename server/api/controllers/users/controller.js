import { EmailInUseError } from "../../../errors/userError";
import asyncErrorHandler from "../../../utils/asyncErrorHandler";
import { created, noContent } from "../../helpers/http";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  return noContent();
});

export { registerUser };
