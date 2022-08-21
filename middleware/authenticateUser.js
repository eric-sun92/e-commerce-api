const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { verifyJWT } = require("../utils");

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnAuthenticatedError("authentication invalid");
  }
  try {
    const { name, userId, role } = verifyJWT({ token });
    req.user = { name: name, userId: userId, role: role };
    next();
  } catch (err) {
    throw new CustomError.UnAuthenticatedError("authentication invalid");
  }
};

module.exports = authenticateUser;
