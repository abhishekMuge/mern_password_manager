const PasswordManagerModel = require("../models/PasswordManager");
const AES = require("crypto-js/aes");
const PasswordManager = require("../models/PasswordManager");

module.exports = {
  savePassword: async (req, res) => {
    try {
      const { password, title } = req.body;
      if (!password) {
        return res
          .status(400)
          .send({ message: "password field in mandatory", success: false });
      }

      const isCollection = await PasswordManagerModel.findOne({
        user: req.user._id,
      });
      if (!isCollection) {
        const newPasswordManager = new PasswordManagerModel({
          user: req.user._id,
          collections: [
            {
              title,
              hashPass: AES.encrypt(
                password,
                process.env.CRYPTOHASHKEY
              ).toString(),
              createdAT: new Date(),
              shared: false,
            },
          ],
        });
        await newPasswordManager.save();
        return res
          .status(200)
          .send({ message: "Password saved successfully", success: true });
      } else {
        let collection = {
          title,
          hashPass: AES.encrypt(password, process.env.CRYPTOHASHKEY).toString(),
          createdAT: new Date(),
          shared: false,
        };

        isCollection.collections.push(collection);
        await isCollection.save();

        res.send("Password Stored successfully");
      }

      return res
        .status(500)
        .send({ message: "Something went wrong", success: false });
    } catch (err) {
      return res.status(500).send({ message: err.message, succes: false });
    }
  },
  deletePasswords: async (req, res) => {
    const { passwordId } = req.params;
    console.log(passwordId, req.user._id);
    try {
      const passwords = await PasswordManagerModel.findOne({
        user: req.user._id,
      });
      if (!passwords) {
        return res
          .status(400)
          .send({ message: "collection not found", success: false });
      } else {
        await PasswordManagerModel.updateOne(
          { user: req.user._id },
          { $pull: { collections: { _id: passwordId } } }
        );
        return res.send({ message: "collection updated", success: true });
      }
      return res.send({ message: "something went wrong", success: false });
    } catch (err) {
      return res.status(500).send({ message: err.message, succes: false });
    }
  },
};
