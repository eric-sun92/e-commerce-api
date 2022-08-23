const Order = require("../models/orderModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../models/productModel");
const { checkUserPermission } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body;

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      `Please provide tax and shipping fee`
    );
  }
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(`Please provide items`);
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product found with id ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, singleOrderItem];
    subtotal += singleOrderItem.price * singleOrderItem.amount;
  }
  const total = tax + shippingFee + subtotal;
  //get client secret with fake stripe api function
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id ${orderId}`);
  }
  checkPermission(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id ${orderId}`);
  }
  checkUserPermission(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const userId = req.user.userId;
  const orders = await Order.find({ user: userId });
  if (!orders) {
    throw new CustomError.NotFoundError(`No orders found by user ${userId}`);
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
