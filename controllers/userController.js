const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiestoResponse,
  checkUserPermission,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  checkUserPermission(req.user, userId);

  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`no user found with ${userId} id`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError(
      "Please enter valid values for both fields"
    );
  }

  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;

  await user.save();

  // const user = await User.findOneAndUpdate(
  //   { _id: req.user.userId },
  //   { name: name, email: email },
  //   { new: true, runValidators: true }
  // );
  const tokenUser = createTokenUser(user);
  attachCookiestoResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please enter valid values for both fields"
    );
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isCorrectPassword = user.checkPassword(oldPassword);
  if (!isCorrectPassword) {
    throw new CustomError.UnAuthenticatedError("Incorrect Password");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
