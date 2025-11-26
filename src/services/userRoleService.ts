import { Types } from "mongoose";
import { UserRoleModel } from "@/models/UserRoleModel";
import { RoleModel } from "@/models/roleModel";
import { UserModel } from "@/models/userModel";

export const AssignRoleToUser = async (req: any) => {
  try {
    const { userId, roleId } = req.body;

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(roleId)) {
      return { status: 400, message: "Invalid userId or roleId format" };
    }

    const user = await UserModel.findById(userId);
    const role = await RoleModel.findById(roleId);

    if (!user) return { status: 404, message: "User not found" };
    if (!role) return { status: 404, message: "Role not found" };

    const existing = await UserRoleModel.findOne({ userId, roleId });
    if (existing) {
      return { status: 400, message: "Role already assigned to this user" };
    }

    const userRole = await UserRoleModel.create({ userId, roleId });

    return {
      status: 201,
      message: "Role assigned to user successfully",
      userRole,
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const RemoveRoleFromUser = async (req: any) => {
  try {
    const { userId, roleId } = req.body;

    const record = await UserRoleModel.findOneAndDelete({ userId, roleId });
    if (!record) {
      return { status: 404, message: "Role assignment not found" };
    }

    return {
      status: 200,
      message: "Role removed from user successfully",
      record,
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const RemoveUserRoleById = async (req: any) => {
  try {
    const { userRoleId } = req.params;

    if (!Types.ObjectId.isValid(userRoleId)) {
      return { status: 400, message: "Invalid role assignment ID format" };
    }

    const record = await UserRoleModel.findByIdAndDelete(userRoleId);

    if (!record) {
      return { status: 404, message: "Role assignment not found" };
    }

    return {
      status: 200,
      message: "Role assignment deleted successfully",
      record,
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const GetUserRoles = async (req: any) => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return { status: 400, message: "Invalid user ID format" };
    }

    const roles = await UserRoleModel.find({ userId }).populate("roleId");

    return {
      status: 200,
      message: "User roles retrieved successfully",
      roles,
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const GetUsersWithRole = async (req: any) => {
  try {
    const { roleId } = req.params;

    if (!Types.ObjectId.isValid(roleId)) {
      return { status: 400, message: "Invalid role ID format" };
    }

    const users = await UserRoleModel.find({ roleId }).populate("userId");

    return {
      status: 200,
      message: "Users with this role retrieved successfully",
      users,
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const GetAllUserRoleAssignments = async (req: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const roles = await UserRoleModel.find()
      .populate("userId roleId")
      .skip(skip)
      .limit(limit);

    const total = await UserRoleModel.countDocuments();

    return {
      status: 200,
      message: "User role assignments retrieved successfully",
      page,
      total,
      data: roles,
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
