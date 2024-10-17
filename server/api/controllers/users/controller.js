import { EmailInUseError } from "../../../errors/userError";
import asyncErrorHandler from "../../../utils/asyncErrorHandler";
import { created } from "../../helpers/http";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  throw new EmailInUseError();
});

export { registerUser };
