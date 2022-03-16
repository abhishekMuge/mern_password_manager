const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: err,
        });
      } else {
        UserModel.findById(decoded.id)
          .then((user) => {
            if (!user) {
              return res.status(401).json({
                message: "User not found",
              });
            } else {
              req.user = user;
              next();
            }
          })
          .catch((err) => {
            return res.status(401).json({
              message: err,
            });
          });
      }
    });
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
