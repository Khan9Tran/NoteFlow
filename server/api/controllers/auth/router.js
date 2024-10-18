import * as express from "express";
import { loginUser } from "./controller.js";
export default express.Router().post("/login", loginUser);
