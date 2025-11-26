import { Types } from "mongoose";
import { UserModel } from "@/models/userModel";
import { UserRoleModel } from "@/models/UserRoleModel";
import { RoleModel } from "@/models/roleModel";

export const GetAllUsers = async (req: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let searchQuery: any = {};

    if (search) {
      searchQuery = {
        $or: [
          { userName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await UserModel.find(searchQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(searchQuery);

    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const userRoles = await UserRoleModel.find({ userId: user._id })
          .populate("roleId", "name description")
          .sort({ assignedAt: -1 });

        const roles = userRoles.map((ur) => ({
          id: ur._id,
          roleId: ur.roleId._id,
          roleName: (ur.roleId as any).name,
          roleDescription: (ur.roleId as any).description,
          assignedAt: ur.assignedAt,
        }));

        return {
          ...user.toObject(),
          roles,
          roleCount: roles.length,
        };
      })
    );

    return {
      status: 200,
      message: "Users retrieved successfully",
      users: usersWithRoles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const SearchUsers = async (req: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query: any = {};

    ["email", "userName", "firstName", "lastName"].forEach((key) => {
      if (req.query[key]) {
        query[key] = { $regex: req.query[key], $options: "i" };
      }
    });

    let users = await UserModel.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(query);

    return {
      status: 200,
      message: "Search results retrieved",
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};
