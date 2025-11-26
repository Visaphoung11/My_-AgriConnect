import mongoose from "mongoose";
import Cart, { ICart } from "../models/cartModel";
import CartItem from "../models/cartItemModel";
import { IProduct } from "../models/productModel";
import { UpdateProductStock } from "./productService";

// Traditional relational database approach with separate tables
export const GetCart = async (userId: string) => {
  try {
    // Find user's cart
    let cart: any = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({ userId });
      await cart.save();
      return {
        status: 200,
        success: true,
        data: {
          userId,
          items: [],
          total: 0,
        },
      };
    }

    // Get cart items from separate collection
    const cartItems = await CartItem.find({ cartId: cart._id }).populate({
      path: "productId",
      select: "name price image stock",
    });

    // Calculate subtotals and total
    let total = 0;
    const itemsWithSubtotals = cartItems.map((item: any) => {
      const subtotal = item.productId.price * item.quantity;
      total += subtotal;

      return {
        _id: item._id,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: subtotal,
      };
    });

    return {
      status: 200,
      success: true,
      data: {
        userId: cart.userId.toString(),
        items: itemsWithSubtotals,
        total: total,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to get cart",
    };
  }
};

export const AddToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  try {
    // Find or create cart
    let cart: any = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }

    // Check if item already exists in cart
    const existingCartItem = await CartItem.findOne({
      cartId: cart._id,
      productId: productId,
    });

    if (existingCartItem) {
      // Update quantity of existing item
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      // Create new cart item
      const newCartItem = new CartItem({
        cartId: cart._id,
        productId: productId,
        quantity: quantity,
      });
      await newCartItem.save();
    }

    // Return cart with populated items
    const result = await GetCart(userId);
    return {
      status: 200,
      success: true,
      message: "Item added to cart successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to add item to cart",
    };
  }
};

export const UpdateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  try {
    // Find cart
    const cart: any = await Cart.findOne({ userId });
    if (!cart) {
      return {
        status: 404,
        success: false,
        message: "Cart not found",
      };
    }

    // Find cart item by its ID
    const cartItem = await CartItem.findById(itemId);
    if (!cartItem || cartItem.cartId.toString() !== cart._id.toString()) {
      return {
        status: 404,
        success: false,
        message: "Cart item not found",
      };
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const result = await GetCart(userId);
    return {
      status: 200,
      success: true,
      message: "Cart item updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to update cart item",
    };
  }
};

export const RemoveFromCart = async (userId: string, itemId: string) => {
  try {
    // Find cart
    const cart: any = await Cart.findOne({ userId });
    if (!cart) {
      return {
        status: 404,
        success: false,
        message: "Cart not found",
      };
    }

    // Find and remove cart item by its ID
    const cartItem = await CartItem.findById(itemId);
    if (!cartItem || cartItem.cartId.toString() !== cart._id.toString()) {
      return {
        status: 404,
        success: false,
        message: "Cart item not found",
      };
    }

    await cartItem.deleteOne();

    const result = await GetCart(userId);
    return {
      status: 200,
      success: true,
      message: "Item removed from cart",
      data: result.data,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to remove item from cart",
    };
  }
};

export const ClearCart = async (userId: string) => {
  try {
    const cart: any = await Cart.findOne({ userId });
    if (!cart) {
      return {
        status: 200,
        success: true,
        message: "Cart is already empty",
      };
    }

    // Remove all cart items
    await CartItem.deleteMany({ cartId: cart._id });
    // Optionally keep the empty cart document

    return {
      status: 200,
      success: true,
      message: "Cart cleared successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to clear cart",
    };
  }
};
