const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkUserPermission } = require("../utils");

const createReview = async (req, res) => {
  const productId = req.body.product;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      "product you are trying to reivew does not exist"
    );
  }
  const userId = req.user.userId;

  const alreadyReviewed = await Review.findOne({
    user: userId,
    product: productId,
  });
  if (alreadyReviewed) {
    throw new CustomError.BadRequestError(
      "You have already reviewed this item once"
    );
  }

  req.body.user = userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  checkUserPermission(req.user, review.user);

  const { rating, title, comment } = req.body;

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id ${reviewId}`);
  }

  checkUserPermission(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ msg: `review ${reviewId} deleted` });
};

const getSingleProductReviews = async (req, res) => {
  const productId = req.params.id;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
