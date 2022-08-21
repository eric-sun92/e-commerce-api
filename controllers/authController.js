const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiestoResponse } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const isUsedEmail = await User.findOne({ email: email });
  if (isUsedEmail) {
    throw new CustomError.BadRequestError("Email already linked to an account");
  }
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiestoResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("please enter username and password");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.UnAuthenticatedError("Invalid Credentials");
  }
  const isCorrectPassword = await user.checkPassword(password);
  if (!isCorrectPassword) {
    throw new CustomError.UnAuthenticatedError("Invalid Credentials");
  }
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiestoResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

module.exports = { register, login, logout };
