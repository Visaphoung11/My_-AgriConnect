import { Request, Response } from "express";
import {
  AssignRoleToUser,
  RemoveRoleFromUser,
} from "@/services/userRoleService";

export const assignRoleToUser = async (req: Request, res: Response) => {
  const result = await AssignRoleToUser(req);
  return res.status(result.status).json(result);
};

export const removeRoleFromUser = async (req: Request, res: Response) => {
  const result = await RemoveRoleFromUser(req);
  return res.status(result.status).json(result);
};
