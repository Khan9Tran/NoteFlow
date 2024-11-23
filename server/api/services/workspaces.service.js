import { Workspace } from "../../models/workspace.schema.js";
import { Page } from "../../models/page.schema.js";
import { created, noContent, ok } from "../helpers/http.js";
import { User } from "../../models/user.schema.js";
import { WorkspaceNotFoundError } from "../../errors/workspaceError.js";
import {
  BadRequestError,
  UserIsExistError,
  UserNotFoundError,
} from "../../errors/userError.js";
import { PageNotFoundError } from "../../errors/pageError.js";
import { ForbiddenError } from "../../errors/authError.js";
const createFirstWorkspace = async (userId, userName) => {
  const newWorkspace = new Workspace({
    name: `${userName}'s Workspace`,
    owner: userId,
    members: [{ userId: userId, role: "admin" }],
  });
  return await newWorkspace.save();
};

const getWorkspaces = async (query, next) => {
  const limit = parseInt(query.limit) || 10; // Số lượng kết quả trên mỗi trang
  const page = parseInt(query.page) || 1; // Trang hiện tại
  const skip = (page - 1) * limit; // Bỏ qua kết quả (skip)
  const search = query.search || ""; // Từ khóa tìm kiếm

  // Điều kiện tìm kiếm dựa trên username hoặc email (ví dụ)
  const searchQuery = {
    $or: [
      { name: { $regex: search, $options: "i" } }, // Tìm theo username (không phân biệt hoa thường)
    ],
  };

  // Lấy thông tin sắp xếp từ query (mặc định sắp xếp theo name tăng dần)
  const sortField = query.sort || "createdAt"; // Trường sắp xếp
  const sortOrder = query.order === "asc" ? 1 : -1; // Thứ tự sắp xếp, mặc định là tăng dần

  // Lấy danh sách người dùng (ngoại trừ trường password)
  const workspace = await Workspace.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ [sortField]: sortOrder }); // Sắp xếp theo trường và thứ tự

  // Tính tổng số người dùng thỏa điều kiện tìm kiếm
  const total = await Workspace.countDocuments(searchQuery);

  // Tính tổng số trang
  const totalPages = Math.ceil(total / limit);

  // Xác định các giá trị hasPrevPage và hasNextPage
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  // Xác định trang tiếp theo và trang trước đó
  const prevPage = hasPrevPage ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;

  // Trả về dữ liệu cùng với thông tin phân trang
  return ok(workspace, "Get WorkSpaces", {
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
const create = async (payload, user) => {
  const newWorkspace = new Workspace({
    name: payload.name,
    owner: user._id,
    members: [{ userId: user._id, role: "admin" }],
  });

  const result = await newWorkspace.save();

  user.workspaces.push(result._id);
  await user.save();

  return created({ _id: result._id });
};

const addMember = async (payload, workspaceId, next) => {
  const user = await User.findOne({ _id: payload._id });

  if (!user) {
    next(new UserNotFoundError());
    return;
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }

  const memberExists = workspace.members.some((member) =>
    member.userId.equals(user._id)
  );
  if (memberExists) {
    next(new UserIsExistError());
    return;
  }

  workspace.members.push({ userId: user._id, role: "member" });
  await workspace.save();

  return ok({
    name: workspace.name,
    members: workspace.members,
  });
};

const deleteworkspace = async (workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }
  await Workspace.deleteOne({ _id: workspaceId });
  return noContent();
};

const getWbById = async (workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId)
    .populate({
      path: "members.userId",
      select: "name profilePicture", // Chỉ lấy các trường name và profilePicture
    })
    .populate({
      path: "owner",
      select: "name profilePicture", // Nếu cần thông tin chủ sở hữu
    });
  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }
  return ok(workspace);
};

const addPagetoWb = async (payload, workspaceId, next) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }
  const newPage = new Page({
    title: payload.title,
    reference: payload.reference,
    workspaceId: workspaceId,
  });
  await newPage.save();

  workspace.pages.push(newPage._id);
  await workspace.save();

  return created(newPage._id);
};

const update = async (req, res, next) => {
  const { userId, changeRole } = req.query;

  if (userId && changeRole) {
    return next(new BadRequestError("Only one query parameter is allowed."));
  }
  if (userId) {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      next(new WorkspaceNotFoundError());
      return;
    }

    const isMemberExist = workspace.members.some(
      (member) => member.userId.toString() === userId
    );

    if (isMemberExist) {
      next(new BadRequestError("User is already a member of this workspace."));
      return;
    }

    workspace.members.push({ userId: userId, role: "member" });

    await workspace.save();
    const user = req.user;
    user.workspaces.push(workspace._id);
    await user.save();

    return ok(workspace);
  }

  if (changeRole) {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      next(new WorkspaceNotFoundError());
      return;
    }

    const member = workspace.members.find(
      (member) => member.userId.toString() === changeRole
    );

    if (!member) {
      next(new UserNotFoundError());
      return;
    }

    const user = req.user;
    if (user._id.toString() !== workspace.owner.toString()) {
      next(new ForbiddenError("You are not allowed to update user role"));
      return;
    }

    if (member.role === "admin") {
      member.role = "member";
    } else {
      member.role = "admin";
    }

    await workspace.save();

    return ok(workspace);
  }

  const workspace = await Workspace.findByIdAndUpdate(
    req.params.workspaceId,
    updateFields,
    { new: true }
  );
  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }
  
  return ok(workspace);
};

const removeMemberFromWb = async (workspaceId, memberId, next) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }

  workspace.members = workspace.members.filter(
    (member) => member.userId.toString() !== memberId
  );
  await workspace.save();

  return noContent();
};

const updateUserAccess = async (req, res, next) => {
  const workspace = await Workspace.findById(req.params.workspaceId);

  if (!workspace) {
    next(new WorkspaceNotFoundError());
    return;
  }

  const member = workspace.members.find(
    (member) => member.userId.toString() === req.params.memberId
  );

  const admin = workspace.members.find(
    (member) =>
      member.userId.toString() === req.user._id.toString() &&
      member.role === "admin"
  );

  if (!admin) {
    return next(new ForbiddenError("You are not allowed to update user role"));
  }

  if (!member) {
    next(new UserNotFoundError());
    return;
  }

  const role = req.body.role;
  if (role === null || role === undefined) {
    return next(new ForbiddenError(""));
  }

  if (role !== "admin" && role !== "member") {
    return next(new ForbiddenError(""));
  }

  member.role = role;

  await workspace.save();

  return ok(member);
};

export {
  createFirstWorkspace,
  create,
  addMember,
  deleteworkspace,
  getWbById,
  addPagetoWb,
  updateUserAccess,
  removeMemberFromWb,
  getWorkspaces,
  update,
};
