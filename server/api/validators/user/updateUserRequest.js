import Joi from "joi";

const userUpdateRequest = Joi.object({
  name: Joi.string().required(),
});

export { userUpdateRequest };
