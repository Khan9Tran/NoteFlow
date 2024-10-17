import * as express from 'express';
import { registerUser } from './controller';
import validate from '../../middlewares/validate';
import { userRegisterRequest } from '../../validators/userValidator';


export default express
  .Router()
  .post('/', validate(userRegisterRequest),registerUser)
