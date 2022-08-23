const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw new CustomError.NotFoundError(`no product with id ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`no product with id ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`no product with id ${productId}`);
  }

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "product deleted" });
};

const uploadImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new CustomError.BadRequestError("no image found");
  }
  const image = req.files.image;

  if (!image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("please upload image");
  }

  const maxImageSize = 1024 * 1024;

  if (image.size > maxImageSize) {
    throw new CustomError.BadRequestError("image file size too large");
  }

  const imagePath = path.join(__dirname, "../public/uploads/", image.name);

  await image.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${image.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
