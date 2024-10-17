import asyncErrorHandler from "../../../utils/asyncErrorHandler.js";
import { created, noContent } from "../../helpers/http.js";
import { create } from "../../services/users.service.js";
import { login } from "../../services/auths.service.js";
const registerUser = asyncErrorHandler(async (req, res, next) => {
  return create(req.body);
});

const loginUser = asyncErrorHandler(async (req, res, next) => { 
    
    return login(req.body); 
    
});

export { registerUser, loginUser };
