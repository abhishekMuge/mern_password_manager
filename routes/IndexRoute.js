const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello server ! App Index Route Works!");
});

module.exports = router;
