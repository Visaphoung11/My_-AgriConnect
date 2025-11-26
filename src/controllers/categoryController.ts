import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export const createCategory = async (req: Request, res: Response) => {
  const result = await categoryService.CreateCategory(req.body);
  return res.status(result.status).json(result);
};

export const getCategories = async (req: Request, res: Response) => {
  const result = await categoryService.GetCategories();
  return res.status(result.status).json(result);
};
