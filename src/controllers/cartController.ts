import { Request, Response } from 'express';
import * as cartService from '../services/cartService';

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await cartService.GetCart(userId);
  return res.status(result.status).json(result);
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'ProductId and quantity (min 1) are required',
    });
  }

  const result = await cartService.AddToCart(userId, productId, quantity);
  return res.status(result.status).json(result);
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be at least 1',
    });
  }

  const result = await cartService.UpdateCartItem(userId, id, quantity);
  return res.status(result.status).json(result);
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  const result = await cartService.RemoveFromCart(userId, id);
  return res.status(result.status).json(result);
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await cartService.ClearCart(userId);
  return res.status(result.status).json(result);
};
