import Joi from "joi";

export const addWorkspaceByUserIdRequest = Joi.object({
  workspaceId: Joi.string().required(),
});

