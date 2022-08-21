const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authenticateUser");

router
  .route("/")
  .get(authenticateUser, authorizePermission("admin"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").post(authenticateUser, updateUser);
router.route("/updateUserPassword").post(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
