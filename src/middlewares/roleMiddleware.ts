import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayloadInput } from "@/types/user";
import { UserRoleModel } from "@/models/UserRoleModel";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    userName: string;
  };
}
export const roleCheck = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const secret = process.env.JWT_SECRET!;
      const decoded = jwt.verify(token, secret) as JwtPayloadInput;

      // Fetch user roles from database
      /**
       * It finds all UserRoleModel rows where the userId matches the logged-in user.

Then it populates the roleId with the role name.
       */
      const userRoles = await UserRoleModel.find({ userId: decoded.id })
        .populate("roleId", "name")
        .exec();

      // Extract role names
      const roleNames = userRoles.map((ur) => (ur.roleId as any).name);

      // Check if user has any of the allowed roles
      const hasPermission = allowedRoles.some((allowedRole) =>
        roleNames.some(
          (userRole) => userRole.toLowerCase() === allowedRole.toLowerCase()
        )
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      }

      // Set user info in request (use first role as primary role for compatibility)
      const sanitizedUser = {
        id: decoded.id,
        role: roleNames[0] || "User", // Use first role or default
        email: decoded.email,
        userName: decoded.userName,
      };

      req.user = sanitizedUser;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};

// Middleware to check if user is authenticated (for endpoints that need user info but not specific roles)
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayloadInput;
    
    const sanitizedUser = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      userName: decoded.userName,
    };
    
    req.user = sanitizedUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// create role middleware here then go to define routes for Admin
