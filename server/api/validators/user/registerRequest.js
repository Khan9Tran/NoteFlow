import Joi from "joi";

const userRegisterRequest = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8) // Độ dài tối thiểu là 8 ký tự
    .max(24) // Độ dài tối đa là 24 ký tự
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])(?!.*\s).*$/) // Yêu cầu mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt và không chứa khoảng trắng
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must be at most 24 characters long.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Password and confirm password must match",
  }),
});


export { userRegisterRequest};
