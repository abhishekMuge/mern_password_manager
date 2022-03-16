const UserModel = require("../models/User");
const yup = require("yup");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const SaltRounds = 10;

module.exports = {
  LoginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const User = await UserModel.findOne({ email });
      if (!User) {
        return res.status(400).json({
          message: "User not found",
        });
      } else {
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
          return res.status(400).json({
            message: "Password is incorrect",
          });
        } else {
          const token = jwt.sign(
            {
              id: User._id,
              email: User.email,
              name: User.firstname + " " + User.lastname,
            },
            process.env.JWT_SECRET
          );
          return res.status(200).json({
            message: "Login Success",
            token,
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  },

  SignUpUser: async (req, res) => {
    const { firstname, lastname, email, password, phone, address } = req.body;

    //schemas
    const userSchema = yup.object().shape({
      firstname: yup.string().required(),
      lastname: yup.string().required(),
      email: yup.string().required(),
      password: yup.string().required().min(10),
    });

    // //validate data for user
    userSchema
      .validate(req.body)
      .then((valid) => {})
      .catch((err) => {
        return res.status(500).json({ message: err.message, success: false });
      });

    //find if user is already in database
    // if yes retutn error
    const User = await UserModel.findOne({ email });
    if (User) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            name: User.firstname + " " + User.lastname,
            id: User.id,
            email: User.email,
          },
        },
        process.env.JWT_SECRET
      );

      return res.status(400).send({
        message: token,
        success: false,
      });
    }

    const bcryptedPassword = await bcrypt.hash(password, SaltRounds);

    // if no save user to database
    const newUser = await new UserModel({
      firstname,
      lastname,
      email,
      password: bcryptedPassword,
    });
    newUser.save();

    //generate token
    const token = jwt.sign(
      {
        name: newUser.firstname + " " + newUser.lastname,
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).send({ message: token, success: true });
  },
  getUserProfile: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);
      user.password = "***************";
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      return res.status(200).json({
        message: "User found",
        user,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  },
};

// "firstname": "abhishek",
// "lastname": "muge",
// "address": "Abc co. housing",
// "phone": 6261628182,
