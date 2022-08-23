const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please enter review rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "please enter review title"],
      maxlength: [150, "review is over 150 characters"],
    },
    comment: {
      type: String,
      required: [true, "please enter review comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageReviews = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageReviews(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageReviews(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
