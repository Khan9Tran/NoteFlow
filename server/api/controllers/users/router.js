import * as express from 'express';
import { registerUser } from './controller.js';
import validate from '../../middlewares/validate.js';
import { userRegisterRequest } from '../../validators/user/registerRequest.js';


export default express
  .Router()
  .post('/', validate(userRegisterRequest),registerUser)
