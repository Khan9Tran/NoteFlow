import * as express from 'express';
import { registerUser, loginUser } from './controller';
import validate from '../../middlewares/validate';
import { userRegisterRequest } from '../../validators/user/registerRequest';
import { userLoginRequest } from '../../validators/user/loginRequest';

export default express
  .Router()
  .post('/', validate(userRegisterRequest),registerUser)
  .post('/login', validate(userLoginRequest), loginUser);