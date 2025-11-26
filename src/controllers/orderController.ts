import { Request, Response } from 'express';
import * as orderService from '../services/orderService';

// Get user's own orders
export const getUserOrders = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await orderService.GetUserOrders(userId);
  return res.status(result.status).json(result);
};

// Get all orders (admin)
export const getAllOrders = async (req: Request, res: Response) => {
  const result = await orderService.GetAllOrders();
  return res.status(result.status).json(result);
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const userRole = (req as any).user.role;
  const result = await orderService.GetOrderById(id, userId, userRole);
  return res.status(result.status).json(result);
};

// Update order status (admin/seller)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await orderService.UpdateOrderStatus(id, status);
  return res.status(result.status).json(result);
};

// Checkout and create order from cart
export const checkout = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { customerName, phone, address } = req.body;
  const result = await orderService.Checkout(userId, { customerName, phone, address });
  return res.status(result.status).json(result);
};
