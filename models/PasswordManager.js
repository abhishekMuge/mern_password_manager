const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordmanagerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAT: {
    type: Date,
    default: Date.now,
  },
  collections: [
    {
      title: {
        type: String,
      },
      hashPass: {
        type: String,
      },
      createdAT: {
        type: Date,
      },
      shared: {
        type: Boolean,
      },
    },
  ],
  shared: [
    {
      passwordId:{
        type: String,
      },
      email: 
      {
        type: String,
      }
    },
    {
      hashPass: {
        type: String,
      }
    }
  ]
});

module.exports = PasswordManager = mongoose.model(
  "Manager",
  PasswordmanagerSchema
);
