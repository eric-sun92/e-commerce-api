const BadRequestError = require("./BadRequest");
const CustomAPIError = require("./CustomAPIError");
const NotFoundError = require("./NotFoundError");
const UnAuthenticatedError = require("./UnAuthenticated");
const UnAuthorizedError = require("./UnAuthorized");

module.exports = {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnAuthenticatedError,
  UnAuthorizedError,
};
