import Joi from "joi";

const createWorkspaceRequest = Joi.object({
  name: Joi.string().required(),
});

export { createWorkspaceRequest };
