require("dotenv").config();
require("express-async-errors");
const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();

//rest of packages
const morgan = require("morgan");
app.use(morgan("tiny"));

const bodyParser = require("body-parser");
app.use(express.static("/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.get("/", (req, res) => {
  res.status(200).send("<h1> ECOMMERCE API </h1>");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

//middleware
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

app.use(notFound);
app.use(errorHandler);

const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
