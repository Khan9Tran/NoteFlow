import * as express from "express";
import { loginUser, registerUser } from "./controller.js";
import validate from "../../middlewares/validate.js";
import { userRegisterRequest } from "../../validators/user/registerRequest.js";
export default express
  .Router()
  .post("/login", loginUser)
  .post("/register", validate(userRegisterRequest), registerUser);
