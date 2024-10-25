import { User } from "../../models/user.schema.js";
import { EmailInUseError, UserNotFoundError } from "../../errors/userError.js";
import _ from "lodash";
import { hashPassword } from "../../security/bcryptPassword.js";
import { created, noContent, ok, serverError } from "../helpers/http.js";
import mongoose from "mongoose";
import logger from "../../common/logger.js";
import { createFirstPage } from "./pages.service.js";
import { createFirstWorkspace } from "./workspaces.service.js";
import {
  WorkspaceHasBeenAddedError,
  WorkspaceNotFoundError,
} from "../../errors/workspaceError.js";
import { Workspace } from "../../models/workspace.schema.js";
import { UnauthorizedError } from "../../errors/authError.js";

// Hàm tạo người dùng
const createUser = async (userData) => {
  const newUser = new User();
  newUser._id = new mongoose.Types.ObjectId();
  Object.assign(newUser, _.pick(userData, ["name", "email"]));
  newUser.password = await hashPassword(userData.password);
  await newUser.save();
  logger.info("User created: " + newUser._id);
  return newUser;
};

const create = async (userData, next) => {
  try {
    let existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      next(new EmailInUseError());
    }

    const newUser = await createUser(userData);
    const workspaceResult = await createFirstWorkspace(
      newUser._id,
      newUser.name
    );

    newUser.workspaces.push(workspaceResult._id);
    await newUser.save();

    const firstPage = await createFirstPage(workspaceResult._id);

    workspaceResult.pages.push(firstPage._id);
    await workspaceResult.save();

    const userWithoutPassword = _.omit(newUser.toObject(), ["password"]);
    return created(userWithoutPassword, "Đăng ký thành công");
  } catch (error) {
    logger.error(error);
    return serverError();
  }
};

const getUserById = async (userId) => {
  logger.info("Getting user info: " + userId);

  const user = await User.findById(userId)
    .select("-password") // Exclude the password from the response
    .populate({
      path: "workspaces",
      populate: {
        path: "pages", // Populate the pages within each workspace
        model: "Page",
        select: "-content",
      },
    });

  if (!user) {
    next(new UserNotFoundError());
  }

  return ok(user); // Return the user object without the password
};

const removeWorkspace = async (user, workspaceId, next) => {
  try {
    await User.updateOne(
      { _id: user._id },
      { $pull: { workspaces: workspaceId } }
    );
  } catch (error) {
    logger.error(error);
    return serverError();
  }
  return noContent();
};

const update = async (user, payload) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      payload,
      { new: true, runValidators: true }
    ).select("-password");
    return ok(updatedUser);
  } catch (error) {
    logger.error(error);
    return serverError();
  }
};

const getWorkspace = async (user) => {
  try {
    const workspaces = await Workspace.find({ _id: { $in: user.workspaces } });
    return ok(workspaces);
  } catch (error) {
    logger.error(error);
    return serverError();
  }
};

const addWorkspace = async (id, payload, user, next) => {
  try {
    const u = await User.findById(id);

    if (!u) next(new UserNotFoundError());

    const ws = await Workspace.findOne({ _id: payload.workspaceId });

    if (!ws) next(new WorkspaceNotFoundError());

    logger.info("Adding workspace to user: " + ws);
    const isAdmin = ws.members.some(
      (member) =>
        member.userId.toString() === user._id.toString() &&
        member.role === "admin"
    );

    if (!isAdmin)
      next(new UnauthorizedError("You are not an admin of this workspace"));

    if (u.workspaces.includes(ws._id)) next(new WorkspaceHasBeenAddedError());

    u.workspaces.push(ws._id);

    return ok(await u.save());
  } catch (error) {
    logger.error(error);
    return serverError();
  }
};

const getUserAuth = async (user, next) => {
  const userWithoutPassword = _.omit(user.toObject(), ["password"]);
  return ok(userWithoutPassword);
};

const getUsers = async (query, next) => {
  const limit = parseInt(query.limit) || 10; // Số lượng kết quả trên mỗi trang
  const page = parseInt(query.page) || 1; // Trang hiện tại
  const skip = (page - 1) * limit; // Bỏ qua kết quả (skip)
  const search = query.search || ""; // Từ khóa tìm kiếm

  // Điều kiện tìm kiếm dựa trên username hoặc email (ví dụ)
  const searchQuery = {
    $or: [
      { name: { $regex: search, $options: "i" } }, // Tìm theo username (không phân biệt hoa thường)
      { email: { $regex: search, $options: "i" } }, // Tìm theo email (không phân biệt hoa thường)
    ],
  };

  // Lấy thông tin sắp xếp từ query (mặc định sắp xếp theo name tăng dần)
  const sortField = query.sort || "createdAt"; // Trường sắp xếp
  const sortOrder = query.order === "asc" ? 1 : -1; // Thứ tự sắp xếp, mặc định là tăng dần

  // Lấy danh sách người dùng (ngoại trừ trường password)
  const users = await User.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ [sortField]: sortOrder }) // Sắp xếp theo trường và thứ tự
    .select("-password"); // Bỏ trường password

  // Tính tổng số người dùng thỏa điều kiện tìm kiếm
  const total = await User.countDocuments(searchQuery);

  // Tính tổng số trang
  const totalPages = Math.ceil(total / limit);

  // Xác định các giá trị hasPrevPage và hasNextPage
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  // Xác định trang tiếp theo và trang trước đó
  const prevPage = hasPrevPage ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;

  // Trả về dữ liệu cùng với thông tin phân trang
  return ok(users, "Get users", {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  });
};

export {
  create,
  getUserById,
  removeWorkspace,
  update,
  getWorkspace,
  addWorkspace,
  getUsers,
  getUserAuth,
};
