
import  { Schema, Document, model } from "mongoose";
import { IUserRole } from "@/types/userRole";


const userRoleSchema = new Schema<IUserRole>( // This is called Explicit = Schema<IUserRole>
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Who assigned this role (optional)
    assignedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const UserRoleModel = model<IUserRole>("UserRole", userRoleSchema);
