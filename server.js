const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
require("dotenv").config();

//golobal variables
port = process.env.PORT || 7070;

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((status) => console.log("connected to db"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//routes
app.use("/api", require("./routes/IndexRoute"));
app.use("/api/users", require("./routes/UserRoute"));
app.use("/api/password-vault", require("./routes/PasswordRoute"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
