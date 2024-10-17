import { verifyPassword } from "../../security/bcryptPassword.js";
import jwt from 'jsonwebtoken'; 
import _ from 'lodash';
import logger from "../../common/logger.js";
import { User } from "../../models/user.schema.js";
import { ok } from "../helpers/http.js";

const login = async (payload) => {
    try {
        const { email, password } = payload;
        
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('tai khoan khong ton tai'); 
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('mat khau khong dung'); 
        }

        
        const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        const userWithoutPassword = _.omit(user.toObject(), ['password']);
        return ok(token, "login success");
    } catch (error) {
        logger.error(error);
        throw error; 
    }
};

export { login };
