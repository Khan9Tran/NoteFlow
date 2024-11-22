import Joi from "joi";

const userUpdateRequest = Joi.object({
  name: Joi.string().required(),
  profilePicture: Joi.object({
    data: Joi.binary().required(), // Dữ liệu nhị phân của ảnh
    contentType: Joi.string().valid("image/png", "image/jpeg").required(), // Chỉ chấp nhận một số loại MIME type
  }).optional(), // Trường này không bắt buộc, vì người dùng có thể không cập nhật ảnh
});

export { userUpdateRequest };
