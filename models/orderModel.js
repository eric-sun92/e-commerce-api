const mongoose = require("mongoose");

const SingleOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please provide tax amount"],
    },
    shippingFee: {
      type: Number,
      required: [true, "Please provide shipping fee"],
    },
    subtotal: {
      type: Number,
      required: [true, "Please provide subtotal amount"],
    },
    total: {
      type: Number,
      required: [true, "Please provide total amount"],
    },
    orderItems: {
      type: [SingleOrderItemSchema],
      required: [true, "Please provide items ordered"],
    },
    status: {
      type: String,
      enum: ["pending", "failed", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide order user"],
    },
    clientSecret: {
      type: String,
      required: [true, "Pleave provide client secret"],
    },
    paymentId: {
      type: String,
    },
  },
  { timeseries: true }
);

module.exports = mongoose.model("Order", OrderSchema);
