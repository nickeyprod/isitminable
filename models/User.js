const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');
const mailBox = require("../custom/mailer");

const UserSchema = new Schema({
  nickname:  { type: String, unique: true, required: true }, // String is shorthand for {type: String}
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  birthday: String,
  city: String,
  bio: String,
  reputation: { type: Number, default: 0.0 },
  dateReg: { type: Date, default: Date.now },
  admin: { type: Boolean, default: false },
  token: { type: String },
  tokenExpTime: { type: Date }
});

UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(this.password, 10, function(err, hash) {
    if (err) {
      console.log("Error during hashing password!");
      return next(err);
    }
    user.password = hash;
    return next();
  });
});

UserSchema.statics.setPassword = function setPassword (token, pass, cb) {
  this.findOne({ token }, (err, user) => {
    if (err) {
      console.log("Error during searching by user token");
      return cb(err);
    }
    
    if (!user || user == null) {
      console.log("User with the token not found");
      const err = new Error("User with the token not found");
      return cb(err);
    }
  
    user.password = pass;
    user.token = "";
    user.tokenExpTime = Date.now();

    user.save((err, result) => {
      if (err) {
        console.log("Error during saving new password");
        return cb(err);
      }
      return cb(null, "OK");
    });
  });
  
};

UserSchema.statics.logIn = function logIn (emailOrNick, pass, cb) {

  this.findOne({ $or: [ {email: emailOrNick}, {nickname: emailOrNick} ]}, (err, user) => {
    if (err) {
      console.log("Error during searching for user!");
      return cb(err);
    }
    if (user == null) {
      console.log("User not found");
      return cb(null, null);
    }

    bcrypt.compare(pass, user.password, function(err, result) {
      if (err) {
        console.log("Error during comparing password!");
        return cb(err);
      }
      return cb(null, result, user._id);
    });
  });
};


UserSchema.statics.resetPassword = function resetPassword (email, cb) {

  this.findOne( { email }, (err, user) => {
    if (err) {
      console.log("Error during searching for user!");
      return cb(err);
    }

    if (user == null) {
      console.log("User not found");
      return cb(null, null);
    }

    // set new token and send it to email......
    const token = uuidv4();
    user.token = token;
    user.tokenExpTime = Date.now() + 1000 * 60 * 60 * 24;

    user.save((err, result) => {
      if (err) {
        console.log("Error during setting new token");
        return cb(err);
      }

      //actually send instructions
      mailBox.sendResetInstructions(user.email, token, (err, result) => {
        if (err) {
          console.log("Error during sending email!");
          return cb(err);
        }
        return cb(null, "OK");
      });

    });
  });
};


module.exports = mongoose.model('User', UserSchema);