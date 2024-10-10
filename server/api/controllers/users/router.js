import * as express from 'express';
import { registerUser } from './controller';


export default express
  .Router()
  .post('/', registerUser)
