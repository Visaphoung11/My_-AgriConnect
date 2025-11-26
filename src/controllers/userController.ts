import { Request, Response } from "express";
import {
  GetAllUsers,
  SearchUsers,
} from "@/services/userService";

export const getUsers = async (req: Request, res: Response) => {
  const result = await GetAllUsers(req);
  return res.status(result.status).json(result);
};

export const searchUsers = async (req: Request, res: Response) => {
  const result = await SearchUsers(req);
  return res.status(result.status).json(result);
};
