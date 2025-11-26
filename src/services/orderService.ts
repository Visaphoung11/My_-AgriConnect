import Order from '../models/orderModel';
import OrderItem from '../models/orderItemModel';
import { UpdateProductStock } from './productService';

// Traditional relational database approach - separate Order and OrderItem tables
export const CreateOrder = async (orderData: any, customerId: string) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { items, ...orderDetails } = orderData;

    // Create order
    const order = new Order({
      ...orderDetails,
      customerId,
      status: 'pending',
      total: 0, // Will be calculated from items
    });

    // Calculate total and validate products
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      // Check product availability and get price
      const productResult = await UpdateProductStock(
        item.productId,
        item.quantity,
        'decrement'
      );

      if (!productResult.success) {
        throw new Error(`Product ${item.productId}: ${productResult.message}`);
      }

      // Type assertion since we know the data exists when success is true
      const productData = productResult.data!;
      const subtotal = productData.price * item.quantity;
      total += subtotal;

      // Create order item
      const orderItem = {
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        subtotal,
      };

      orderItems.push(orderItem);
    }

    // Update order total
    order.total = total;

    // Save order and order items
    await order.save({ session });
    await OrderItem.insertMany(orderItems, { session });

    await session.commitTransaction();
    session.endSession();

    // Populate order with items
    const savedOrder = await Order.findById(order._id);

    return {
      status: 201,
      success: true,
      message: 'Order created successfully',
      data: savedOrder,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to create order',
    };
  }
};

export const GetOrders = async (filters: any = {}) => {
  try {
    const { status, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sortOption: any = {};
    sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .sort(sortOption)
      .populate('customerId', 'firstName lastName email')
      .populate('customerId');

    return {
      status: 200,
      success: true,
      data: orders,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch orders',
    };
  }
};

export const GetOrderById = async (id: string, userId: string, userRole: string) => {
  try {
    const order = await Order.findById(id)
      .populate('customerId', 'firstName lastName email');

    if (!order) {
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }

    // Check permissions: admin/seller can see any order, buyer can see their own
    if (userRole !== 'ADMIN' && userRole !== 'SELLER' && order.customerId.toString() !== userId) {
      return {
        status: 403,
        success: false,
        message: 'Forbidden: Not authorized to view this order',
      };
    }

    // Get order items separately
    const orderItems = await OrderItem.find({ orderId: id })
      .populate('productId', 'name price image');

    return {
      status: 200,
      success: true,
      data: {
        ...order.toObject(),
        items: orderItems.map(item => ({
          _id: item._id,
          productId: item.productId,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }))
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch order',
    };
  }
};

export const UpdateOrderStatus = async (id: string, status: string) => {
  try {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return {
        status: 400,
        success: false,
        message: 'Invalid status',
      };
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }

    return {
      status: 200,
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to update order status',
    };
  }
};

export const GetUserOrders = async (userId: string) => {
  try {
    const orders = await Order.find({ customerId: userId })
      .sort({ createdAt: -1 })
      .populate('customerId', 'firstName lastName email');

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({ orderId: order._id })
          .populate('productId', 'name price image');

        return {
          ...order.toObject(),
          items: orderItems.map(item => ({
            _id: item._id,
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          }))
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
      message: error.message || 'Failed to fetch user orders',
    };
  }
};

export const GetAllOrders = async () => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('customerId', 'firstName lastName email');

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({ orderId: order._id })
          .populate('productId', 'name price image');

        return {
          ...order.toObject(),
          items: orderItems.map(item => ({
            _id: item._id,
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          }))
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
      message: error.message || 'Failed to fetch all orders',
    };
  }
};

export const Checkout = async (customerId: string, shippingDetails: { customerName: string; phone: string; address: string }) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // Get user's cart using cart service (avoid circular import by dynamic import)
    const cartService = await import('./cartService');
    const cartResult = await cartService.GetCart(customerId);

    if (!cartResult.success || !cartResult.data || cartResult.data.items.length === 0) {
      await session.abortTransaction();
      session.endSession();

      return {
        status: 400,
        success: false,
        message: 'Cart is empty',
      };
    }

    const cart = cartResult.data;

    // Calculate totals and validate products
    let total = 0;

    // Create the order first
    const order = new Order({
      ...shippingDetails,
      customerId,
      status: 'pending',
      total: 0, // Will be calculated
    });

    // Save order first to get _id
    await order.save({ session });

    // Create order items in separate collection
    const orderItems = [];
    for (const item of cart.items) {
      const productId = item.productId._id || item.productId;

      // Check product availability and get price
      const productResult = await UpdateProductStock(
        productId,
        item.quantity,
        'decrement'
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
    const savedOrder = await Order.findById(order._id)
      .populate('customerId', 'firstName lastName email');

    // Get order items separately
    const orderItemsPopulated = await OrderItem.find({ orderId: order._id })
      .populate('productId', 'name price image');

    // Combine for response
    const populatedOrder = savedOrder!.toObject();
    (populatedOrder as any).items = orderItemsPopulated.map(item => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    return {
      status: 201,
      success: true,
      message: 'Order placed successfully from cart',
      data: populatedOrder,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to process checkout',
    };
  }
};

export const ProcessCheckout = async (customerId: string, shippingDetails: { customerName: string; phone: string; address: string }) => {
  // This is handled by Checkout function above
  return Checkout(customerId, shippingDetails);
};

export const DeleteOrder = async (id: string) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // First, find and delete order items
    await OrderItem.deleteMany({ orderId: id }, { session });

    // Then delete the order
    const deletedOrder = await Order.findByIdAndDelete(id, { session });

    if (!deletedOrder) {
      await session.abortTransaction();
      session.endSession();

      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }

    await session.commitTransaction();
    session.endSession();

    return {
      status: 200,
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to delete order',
    };
  }
};
