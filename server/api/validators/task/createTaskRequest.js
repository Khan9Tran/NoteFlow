import Joi from "joi";

export const createTaskRequest = Joi.object({
  pageId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().optional().allow(""),
  status: Joi.string()
    .valid("not_started", "in_progress", "done")
    .default("not_started"),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  dueDate: Joi.date().optional(),
  assignedTo: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
  subtasks: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      status: Joi.string().valid("not_started", "done").default("not_started"),
    })
      .optional()
      .allow(null)
  ),
});

