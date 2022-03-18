const router = require("express").Router();
const PasswordController = require("../controller/Password");
const userAuth = require("../middleware/auth");
router.get("/getAllPassword", function (req, res) {
  res.send("ALL Password getting");
});

router.post("/save-password", userAuth, PasswordController.savePassword);
router.post("/share-password", userAuth, PasswordController.sharePassword);

router.get("/getPassword", function (req, res) {
  res.send("Password getting");
});
router.get(
  "/delete-password/:passwordId",
  userAuth,
  PasswordController.deletePasswords
);

router.get("/decrypt/:passwordId", userAuth, PasswordController.passwordDecrypt)

module.exports = router;
