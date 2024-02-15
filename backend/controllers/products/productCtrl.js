// On fera avec NPM I EXPRESS-ASYNC-HANDLER dans le 02

import asyncHandler from "express-async-handler";
import { ProductModel } from "../../models/Product.js";

// GET ALL
const getProducts = asyncHandler(async (req, res, next) => {
  // 🥰😘 Pour faire la pagination

  // Page
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  // Search
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await ProductModel.countDocuments({ ...keyword });
  const products = await ProductModel.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
});

// CREATE admin  post=> /api/products
const createProduct = asyncHandler(async (req, res, next) => {
  const product = new ProductModel({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// GET ID
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Ce produit n'existe pas");
  }
});

// Update the product Admin put => api/products/:id
const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await ProductModel.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("L'article est introuvable");
  }
});

// DELETE => api/products/:id
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    await ProductModel.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Le produit a été supprimé avec succes" });
  } else {
    res.status(404);
    throw new Error("Le produit est introuvable");
  }
});

// Top rated products get => api/products/top
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products);
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
};
