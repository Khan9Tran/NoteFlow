import Joi from "joi";

export const createNewPageRequest = Joi.object({
  title: Joi.string().required(),
  workspaceId: Joi.string().required(),
});
