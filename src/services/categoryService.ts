import Category from '../models/categoryModel';
import { ICategory } from '../models/categoryModel';

export const CreateCategory = async (categoryData: ICategory) => {
  try {
    const existingCategory = await Category.findOne({ name: categoryData.name });

    if (existingCategory) {
      return {
        status: 400,
        success: false,
        message: 'Category with this name already exists',
      };
    }

    const category = await Category.create(categoryData);

    return {
      status: 201,
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to create category',
    };
  }
};

export const GetCategories = async () => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    return {
      status: 200,
      success: true,
      data: categories,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch categories',
    };
  }
};

export const GetCategoryById = async (id: string) => {
  try {
    const category = await Category.findById(id);
    
    if (!category) {
      return {
        status: 404,
        success: false,
        message: 'Category not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      data: category,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to fetch category',
    };
  }
};

export const UpdateCategory = async (id: string, updateData: Partial<ICategory>) => {
  try {
    if (updateData.name) {
      const existingCategory = await Category.findOne({ name: updateData.name, _id: { $ne: id } });
      
      if (existingCategory) {
        return {
          status: 400,
          success: false,
          message: 'Category with this name already exists',
        };
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return {
        status: 404,
        success: false,
        message: 'Category not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to update category',
    };
  }
};

export const DeleteCategory = async (id: string) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return {
        status: 404,
        success: false,
        message: 'Category not found',
      };
    }
    
    return {
      status: 200,
      success: true,
      message: 'Category deleted successfully',
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      message: error.message || 'Failed to delete category',
    };
  }
};
