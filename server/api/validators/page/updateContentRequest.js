import Joi from "joi";

// Định nghĩa schema cho từng phần tử trong mảng content
const contentItemSchema = Joi.object({
  type: Joi.string().valid("task", "text").required(),
  taskId: Joi.string()
    .optional() // Chỉ cần nếu type là "task"
    .custom((value, helpers) => {
      // Kiểm tra nếu type là "task", taskId phải có giá trị
      if (
        !helpers.state.ancestors[0].type ||
        helpers.state.ancestors[0].type === "task"
      ) {
        if (!value) {
          return helpers.error("any.required");
        }
      }
      return value;
    }),
  text: Joi.string()
    .optional() // Chỉ cần nếu type là "text"
    .custom((value, helpers) => {
      // Kiểm tra nếu type là "text", text phải có giá trị
      if (
        !helpers.state.ancestors[0].type ||
        helpers.state.ancestors[0].type === "text"
      ) {
        if (!value) {
          return helpers.error("any.required");
        }
      }
      return value;
    }),
});

// Định nghĩa schema cho mảng content
const updateContentSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.array().items(contentItemSchema),
});

// Hàm validate
const validateUpdateContent = (data) => {
  return updateContentSchema.validate(data);
};

export { validateUpdateContent };
