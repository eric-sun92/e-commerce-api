const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const isUsedEmail = await User.findOne({ email: email });
  if (isUsedEmail) {
    throw new CustomError.BadRequestError("Email already linked to an account");
  }
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = { name: this.name, userId: this._id, role: this.role };
  const token = user.createJWT(tokenUser);
  if (!token) {
    throw new CustomError.BadRequestError("Token Unable to be Created");
  }

  res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};

const login = async (req, res) => {
  res.send("login");
};

const logout = async (req, res) => {
  res.send("logout");
};

module.exports = { register, login, logout };
