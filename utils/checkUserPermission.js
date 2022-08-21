const CustomError = require("../errors");

const checkUserPermission = (user, resourceUserId) => {
  if (user.role === "admin") return;
  if (user.userId === resourceUserId.toString()) return;
  throw new CustomError.UnAuthorizedError("not authorized to this route");
};

module.exports = checkUserPermission;
