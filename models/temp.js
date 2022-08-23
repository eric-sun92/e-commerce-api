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

MongoClient.connect(
  "",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db("").collection("");
    coll.aggregate(agg, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  }
);
