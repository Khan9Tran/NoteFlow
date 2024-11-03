import Joi from "joi";

export const createCommentRequest = Joi.object({
  text: Joi.string().required().min(1).max(1000),
});
