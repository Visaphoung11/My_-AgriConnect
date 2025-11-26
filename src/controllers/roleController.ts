import { Request, Response } from "express";
import {
  CreateRole,
  GetAllRoles,
} from "@/services/roleService";

export const createRole = async (req: Request, res: Response) => {
  const result = await CreateRole(req.body);
  return res.status(result.status).json(result);
};

export const getAllRoles = async (req: Request, res: Response) => {
  const result = await GetAllRoles();
  return res.status(result.status).json(result);
};
