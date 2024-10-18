import * as express from "express";
import { registerUser, loginUser } from "./controller.js";
import validate from "../../middlewares/validate.js";
import { userRegisterRequest } from "../../validators/user/registerRequest.js";
import { userLoginRequest } from "../../validators/user/loginRequest.js";
import authMiddleware from "../../../security/auth-middleware.js";

export default express
  .Router()
  .post("/", validate(userRegisterRequest), registerUser)
  .post("/login", validate(userLoginRequest), loginUser);
