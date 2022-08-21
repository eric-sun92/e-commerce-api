const jwt = require("jsonwebtoken");
const ONE_DAY = 1000 * 60 * 60 * 24;

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const verifyJWT = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiestoResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    signed: true,
  });
};

module.exports = { createJWT, verifyJWT, attachCookiestoResponse };
