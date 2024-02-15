import asyncHandler from "express-async-handler";
import { ProductModel } from "../../models/Product.js";

// POST review => /api/products/:id/reviews
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await ProductModel.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (x) => x.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Vous avez déjà noté l'article");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Votre note est publiée" });
  } else {
    res.status(404);
    throw new Error("L'article n'existe pas");
  }
});

export { createReview };
