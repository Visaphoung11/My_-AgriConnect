import mongoose from "mongoose";
import Product from "../models/productModel";
import { IProduct } from "../models/productModel";

export const CreateProduct = async (productData: any) => {
  try {
    // Validate required fields
    if (!productData.userId) {
      throw new Error("userId is required");
    }

    if (!productData.categoryId) {
      throw new Error("categoryId is required");
    }

    // Set default values for required fields if not provided
    const productPayload = {
      ...productData,
      // Use image array from request, default to empty array
      image: productData.image || [],
      // Set available based on stock
      available: productData.stock > 0,
    };

    const product = await Product.create(productPayload);

    return {
      status: 201,
      success: true,
      message: "Product created successfully",
      data: product,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to create product",
    };
  }
};

export const GetProducts = async (filters: any = {}) => {
  try {
    const { category, minPrice, maxPrice, available, search } = filters;

    const query: any = {};

    if (category) {
      query.categoryId = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (available !== undefined) {
      query.available = available === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .populate("userId", "name email")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      success: true,
      data: products,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to fetch products",
    };
  }
};

export const GetProductById = async (id: string) => {
  try {
    const product = await Product.findById(id)
      .populate("userId", "name email")
      .populate("categoryId", "name description");

    if (!product) {
      return {
        status: 404,
        success: false,
        message: "Product not found",
      };
    }

    return {
      status: 200,
      success: true,
      data: product,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to fetch product",
    };
  }
};

export const UpdateProduct = async (
  id: string,
  updateData: Partial<IProduct>
) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email")
      .populate("categoryId", "name");

    if (!updatedProduct) {
      return {
        status: 404,
        success: false,
        message: "Product not found",
      };
    }

    return {
      status: 200,
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to update product",
    };
  }
};

export const DeleteProduct = async (id: string) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return {
        status: 404,
        success: false,
        message: "Product not found",
      };
    }

    return {
      status: 200,
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to delete product",
    };
  }
};

export const UpdateProductStock = async (
  productId: string,
  quantity: number,
  operation: "increment" | "decrement"
) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        status: 404,
        success: false,
        message: "Product not found",
      };
    }

    if (operation === "decrement" && product.stock < quantity) {
      return {
        status: 400,
        success: false,
        message: "Insufficient stock",
      };
    }

    const update =
      operation === "increment"
        ? { $inc: { stock: quantity } }
        : { $inc: { stock: -quantity } };

    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    });

    return {
      status: 200,
      success: true,
      data: updatedProduct,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || "Failed to update product stock",
    };
  }
};
