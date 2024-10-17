import asyncErrorHandler from "../../../utils/asyncErrorHandler";
import { create } from "../../services/users.service";
import { created } from "../../helpers/http";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const result = await create(req.body);
  return created({ message: "Success", data: result });
});

export { registerUser };
