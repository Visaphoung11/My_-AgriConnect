import { Request, Response } from "express";
import * as orderService from "../services/orderService";

// Get user's own orders
export const getUserOrders = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await orderService.GetUserOrders(userId);
  return res.status(result.status).json(result);
};

// Checkout and create order from cart
export const checkout = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { customerName, phone, address } = req.body;
  const result = await orderService.Checkout(userId, {
    customerName,
    phone,
    address,
  });
  return res.status(result.status).json(result);
};
