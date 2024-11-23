import Joi from "joi";

const userUpdateRequest = Joi.object({
  name: Joi.string().optional(),
  profilePicture: Joi.object({
    data: Joi.string().optional(), // Dữ liệu ảnh dưới dạng base64
    contentType: Joi.string().valid("image/png", "image/jpeg").required(), // Chỉ chấp nhận một số loại MIME type
  }).optional(), // Trường này không bắt buộc, vì người dùng có thể không cập nhật ảnh
});

export { userUpdateRequest };
