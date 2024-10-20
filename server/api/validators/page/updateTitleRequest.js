import Joi from "joi";

export const updateTitleRequest = Joi.object({
  title: Joi.string().required(),
});
