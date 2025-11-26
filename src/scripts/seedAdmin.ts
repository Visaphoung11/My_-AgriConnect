import { UserModel } from "@/models/userModel"
import { RoleModel } from "@/models/roleModel"
import { UserRoleModel } from "@/models/UserRoleModel"
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const seedAdminUser = async () => {
  // Ensure ADMIN role exists
  let adminRole = await RoleModel.findOne({ name: "ADMIN" });
  if (!adminRole) {
    adminRole = new RoleModel({ name: "ADMIN", description: "Administrator role" });
    await adminRole.save();
    console.log("✅ ADMIN role seeded");
  }

  // Seed or update admin user
  const existingAdmin = await UserModel.findOne({
    $or: [
      { email: process.env.EMAIL_ADMIN },
      { userName: process.env.USER_NAME_ADMIN },
      { fullName: process.env.FULL_NAME_ADMIN },
    ],
  });

  let adminUser: any;
  if (existingAdmin) {
    existingAdmin.role = "admin";
    existingAdmin.password = await bcrypt.hash(process.env.PASSWORD_ADMIN!, 10);
    await existingAdmin.save();
    adminUser = existingAdmin;
    console.log("♻️ Admin user updated");
  } else {
    const hashedPassword = await bcrypt.hash(process.env.PASSWORD_ADMIN!, 10);

    adminUser = new UserModel({
      firstName: process.env.FIRST_NAME_ADMIN || "Admin",
      lastName: process.env.LAST_NAME_ADMIN || "User",
      userName: process.env.USER_NAME_ADMIN,
      fullName: process.env.FULL_NAME_ADMIN,
      age: 30,
      email: process.env.EMAIL_ADMIN,
      phone: process.env.PHONE_ADMIN || "000000000",

      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    console.log("✅ Admin user seeded successfully");
  }

  // Ensure admin user has ADMIN role assigned
  const existingUserRole = await UserRoleModel.findOne({
    userId: adminUser._id,
    roleId: adminRole._id,
  });
  if (!existingUserRole) {
    const userRole = new UserRoleModel({
      userId: adminUser._id,
      roleId: adminRole._id,
      assignedBy: adminUser._id, // Self-assigned for seeding
    });
    await userRole.save();
    console.log("✅ Admin role assigned to user");
  }
};
