import { Request, Response } from "express";
import * as productService from "../services/productService";

export const createProduct = async (req: Request, res: Response) => {
  // Get userId from authenticated user
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const result = await productService.CreateProduct({
    ...req.body,
    userId,
  });

  return res.status(result.status).json(result);
};

export const getProducts = async (req: Request, res: Response) => {
  const result = await productService.GetProducts(req.query);
  return res.status(result.status).json(result);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.UpdateProduct(id, req.body);
  return res.status(result.status).json(result);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.DeleteProduct(id);
  return res.status(result.status).json(result);
};
