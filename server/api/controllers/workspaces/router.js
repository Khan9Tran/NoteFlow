import * as express from 'express';
import { registerUser } from './controller.js';


export default express
  .Router()
  .post('/', registerUser)
