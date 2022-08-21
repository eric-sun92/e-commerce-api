const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

const authenticateUser = require("../middleware/authenticateUser");

router.route("/").get(authenticateUser, getAllUsers);

router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").post(updateUser);
router.route("/updateUserPassword").post(updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
