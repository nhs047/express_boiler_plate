const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: [
      {
      password: {
        type: String,
      },
      isDeleted: {
        type: Boolean
      }
    }
    ]
  },
  fullname: {
    type: String
  },
  email: {
    type: String
  },
  location: {
    type: String
  },
  contact: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    required: true
  }
}, {
  versionKey: false // You should be aware of the outcome after set to false
});
userSchema.plugin(uniqueValidator);
const userdata = mongoose.model('userdata', userSchema);
module.exports.userdata = userdata;
