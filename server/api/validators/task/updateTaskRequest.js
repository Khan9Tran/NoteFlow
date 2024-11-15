import Joi from "joi";

export const updateTaskRequest = Joi.object({
  status: Joi.string().valid("not_started", "in_progress", "done").optional(),
  title: Joi.string().min(1).max(255).optional(), // optional để không bắt buộc phải có
  description: Joi.string().optional().allow(""), // cho phép chuỗi rỗng
  priority: Joi.string().valid("low", "medium", "high").optional(),
  dueDate: Joi.date().optional(),
  assignedTo: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional(),
  subtasks: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string()
          .required()
          .pattern(/^[0-9a-fA-F]{24}$/),
        title: Joi.string().optional(),
        status: Joi.string().valid("not_started", "done").optional(),
      })
        .optional()
        .allow(null)
    )
    .optional(),
  comments: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string()
          .required()
          .pattern(/^[0-9a-fA-F]{24}$/),
        text: Joi.string().required(), // Comment text bắt buộc
        createdAt: Joi.date().optional(),
      })
    )
    .optional(),
}).min(1);
