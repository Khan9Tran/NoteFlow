import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { create } from "../../services/users.service.js";

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const result = await create(req.body);
  res.status(201).json({ message: "Success", data: result });
});

export { registerUser };
