import Order from "../models/orderModel";
import OrderItem from "../models/orderItemModel";
import { UpdateProductStock } from "./productService";

// Traditional relational database approach - separate Order and OrderItem tables
export const GetUserOrders = async (userId: string) => {
  try {
    const orders = await Order.find({ customerId: userId })
      .sort({ createdAt: -1 })
      .populate("customerId", "firstName lastName email");

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({
          orderId: order._id,
        }).populate("productId", "name price image");

        return {
          ...order.toObject(),
          items: orderItems.map((item) => ({
            _id: item._id,
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        };
      })
    );

    return {
      status: 200,
      success: true,
      data: ordersWithItems,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to fetch user orders",
    };
  }
};

export const Checkout = async (
  customerId: string,
  shippingDetails: { customerName: string; phone: string; address: string }
) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // Get user's cart using cart service
    const cartService = await import("./cartService");
    const cartResult = await cartService.GetCart(customerId);

    if (
      !cartResult.success ||
      !cartResult.data ||
      cartResult.data.items.length === 0
    ) {
      await session.abortTransaction(); // meaning start transaction
      session.endSession();

      return {
        status: 400,
        success: false,
        message: "Cart is empty",
      };
    }

    const cart = cartResult.data;

    // Calculate totals and validate products
    let total = 0;

    // Create the order first
    const order = new Order({
      // create new order
      ...shippingDetails,
      customerId,
      status: "pending",
      total: 0, // Will be calculated
    });

    // Save order first to get _id
    await order.save({ session });

    // loop cartItems
    const orderItems = [];
    for (const item of cart.items) {
      const productId = item.productId._id || item.productId;

      // Check product availability and get price
      const productResult = await UpdateProductStock(
        productId,
        item.quantity,
        "decrement"
      );

      if (!productResult.success) {
        throw new Error(`Product ${item.productId}: ${productResult.message}`);
      }

      // Type assertion since we know the data exists when success is true
      const productData = productResult.data!;
      const subtotal = productData.price * item.quantity;
      total += subtotal;

      // Create separate order item
      const orderItem = new OrderItem({
        orderId: order._id,
        productId: productId,
        quantity: item.quantity,
        subtotal: subtotal,
      });

      orderItems.push(orderItem);
    }

    // Save order items
    await OrderItem.insertMany(orderItems, { session });

    // Update order total
    order.total = total;
    await order.save({ session });

    // Clear the cart after successful order
    await cartService.ClearCart(customerId);

    await session.commitTransaction();
    session.endSession();

    // Populate order with items and product details
    const savedOrder = await Order.findById(order._id).populate(
      "customerId",
      "firstName lastName email"
    );

    // Get order items separately
    const orderItemsPopulated = await OrderItem.find({
      orderId: order._id,
    }).populate("productId", "name price image");

    // Combine for response
    const populatedOrder = savedOrder!.toObject(); // savedOrder! = is not null here./**
    // toObject() converts a Mongoose document into a plain JavaScript object
    // (no Mongoose methods), so you can safely add fields (like items) and return it in JSON. */
    (populatedOrder as any).items = orderItemsPopulated.map((item) => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    return {
      status: 201,
      success: true,
      message: "Order placed successfully from cart",
      data: populatedOrder,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return {
      status: 500,
      success: false,
      message: error.message || "Failed to process checkout",
    };
  }
};
