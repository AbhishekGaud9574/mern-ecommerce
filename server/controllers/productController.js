import productModel from "../models/productModel.js";
import fs from 'fs';
import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js';
import Model from "../models/orderModel.js"; // COD ke liye zaroori
import dotenv from 'dotenv';

dotenv.config();

// Create Product Controller
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files || {};

    const shippingValue =
      shipping === true ||
      shipping === "true" ||
      shipping === "1";

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: 'Name is Required' });
      case !description:
        return res.status(400).send({ error: 'Description is Required' });
      case isNaN(Number(price)):
        return res.status(400).send({
          success: false,
          error: "Price must be a valid number",
        });
      case Number(price) <= 0:
        return res.status(400).send({
          success: false,
          error: "Price must be greater than 0",
        });
      case !category:
        return res.status(400).send({ error: 'Category is Required' });
      case isNaN(Number(quantity)):
        return res.status(400).send({
          success: false,
          error: "Quantity must be a valid number",
        });
      case Number(quantity) < 0:
        return res.status(400).send({
          success: false,
          error: "Quantity must be 0 or greater",
        });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: 'Photo should be less than 1mb' });
    }

    const existingProduct = await productModel.findOne({
      slug: slugify(name),
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    const products = new productModel({
      ...req.fields,
      price: Number(price),
      quantity: Number(quantity),
      inStock: Number(quantity) > 0,
      shipping: shippingValue,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully!",
      products
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while creating product',
      error: error.message,
    });
  }
};

// Get all products
export const getProductController = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 12);

    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await productModel.countDocuments();

    res.status(200).send({
      success: true,
      totalcount: total,
      message: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting products",
      error: error.message
    });
  }
};

// Get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug }).select('-photo').populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Get single product",
      product
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message
    });
  }
};

// Get product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pid)
      .select("photo");

    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }

    return res.status(404).send("Photo not found");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

// Update product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files || {};

    const shippingValue =
      shipping === true ||
      shipping === "true" ||
      shipping === "1";

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: 'Name is Required' });
      case !description:
        return res.status(400).send({ error: 'Description is Required' });
      case isNaN(Number(price)):
        return res.status(400).send({
          success: false,
          error: "Price must be a valid number",
        });
      case Number(price) <= 0:
        return res.status(400).send({
          success: false,
          error: "Price must be greater than 0",
        });
      case !category:
        return res.status(400).send({ error: 'Category is Required' });
      case isNaN(Number(quantity)):
        return res.status(400).send({
          success: false,
          error: "Quantity must be a valid number",
        });
      case Number(quantity) < 0:
        return res.status(400).send({
          success: false,
          error: "Quantity must be 0 or greater",
        });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: 'Photo is Required and should be less than 1mb' });
    }

    const existingProduct = await productModel.findOne({
      slug: slugify(name),
      _id: { $ne: req.params.pid },
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product name already exists",
      });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        price: Number(price),
        quantity: Number(quantity),
        inStock: Number(quantity) > 0,
        shipping: shippingValue,
        slug: slugify(name),
      },
      { new: true, runValidators: true }
    );

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.mimetype;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully!",
      product: products
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while updating product',
      error: error.message,
    });
  }
};

// Delete product
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully!",
      product: product
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message
    });
  }
};

// Product filter
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked?.length > 0) args.category = checked;
    if (radio?.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel
      .find(args)
      .populate("category")
      .select("-photo");

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error While Filtering Products", error: error.message });
  }
};

// Product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error in product count", error: error.message });
  }
};

// Product Pagination
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = parseInt(req.params.page) || 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const total = await productModel.countDocuments();

    res.status(200).json({
      success: true,
      products,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching products", error: error.message });
  }
};

// Search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    }).populate("category").select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error in search product API", error: error.message });
  }
};

// Related products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel.find({
      category: cid,
      _id: { $ne: pid }
    }).select("-photo").limit(3).populate("category");
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error while getting related products", error: error.message });
  }
};

// Products by category
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const products = await productModel.find({
      category: category._id
    }).populate("category");

    res.status(200).send({ success: true, category, products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: "Error while getting products", error: error.message });
  }
};

