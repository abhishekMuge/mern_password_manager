const router = require("express").Router();
const UserController = require("../controller/User");
const UserAuth = require("../middleware/auth");
router.post("/signup", UserController.SignUpUser);

router.get("/login", UserController.LoginUser);

router.get("/profile", UserAuth, UserController.getUserProfile);

module.exports = router;
