const { UnAuthenticatedError } = require("../errors");
const jwt = require("json-web-token");

const authorize = async (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthenticatedError("No Token Found");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
  } catch (err) {
    throw new UnAuthenticatedError("Not Authorized");
  }
};

module.exports = authorize;
