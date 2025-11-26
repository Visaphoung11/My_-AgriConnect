import { Types } from "mongoose";
import { RoleModel } from "@/models/roleModel";
import { UserRoleModel } from "@/models/UserRoleModel";
import { IRole } from "@/types/role";

// Create
export const CreateRole = async (roleData: IRole) => {
  try {
    const existingRole = await RoleModel.findOne({ name: roleData.name });

    if (existingRole) {
      return {
        status: 400,
        success: false,
        message: "Role with this name already exists",
      };
    }

    const role = await RoleModel.create(roleData);

    return {
      status: 201,
      success: true,
      message: "Role created successfully",
      data: role,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to create role",
    };
  }
};

// Get All
export const GetAllRoles = async (page = 1, limit = 10, search = "") => {
  try {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const roles = await RoleModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await RoleModel.countDocuments(query);

    return {
      status: 200,
      success: true,
      data: roles,
      count: roles.length,
      total,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to fetch roles",
    };
  }
};

// Get By ID
export const GetRoleById = async (roleId: string) => {
  try {
    if (!Types.ObjectId.isValid(roleId)) {
      return {
        status: 400,
        success: false,
        message: "Invalid role ID format",
      };
    }

    const role = await RoleModel.findById(roleId);

    if (!role) {
      return {
        status: 404,
        success: false,
        message: "Role not found",
      };
    }

    return {
      status: 200,
      success: true,
      data: role,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to fetch role",
    };
  }
};

// Update
export const UpdateRole = async (
  roleId: string,
  updateData: Partial<IRole>
) => {
  try {
    if (!Types.ObjectId.isValid(roleId)) {
      return {
        status: 400,
        success: false,
        message: "Invalid role ID format",
      };
    }

    // Prevent duplicate role names
    if (updateData.name) {
      const existingRole = await RoleModel.findOne({
        name: updateData.name,
        _id: { $ne: roleId },
      });

      if (existingRole) {
        return {
          status: 400,
          success: false,
          message: "Role with this name already exists",
        };
      }
    }

    const updatedRole = await RoleModel.findByIdAndUpdate(roleId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRole) {
      return {
        status: 404,
        success: false,
        message: "Role not found",
      };
    }

    return {
      status: 200,
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to update role",
    };
  }
};

// Delete
export const DeleteRole = async (roleId: string) => {
  try {
    if (!Types.ObjectId.isValid(roleId)) {
      return {
        status: 400,
        success: false,
        message: "Invalid role ID format",
      };
    }

    const assigned = await UserRoleModel.find({ roleId });
    if (assigned.length > 0) {
      return {
        status: 400,
        success: false,
        message: "Cannot delete a role assigned to users",
      };
    }

    const deleted = await RoleModel.findByIdAndDelete(roleId);

    if (!deleted) {
      return {
        status: 404,
        success: false,
        message: "Role not found",
      };
    }

    return {
      status: 200,
      success: true,
      message: "Role deleted successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to delete role",
    };
  }
};
