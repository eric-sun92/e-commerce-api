const agg = [
  {
    $match: {
      product: new ObjectId("6304073a22fa1e3f62cb9fb2"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
