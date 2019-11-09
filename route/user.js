const express = require('express');
const user = express.Router();
const { connect } = require('../database/dbconnection');
const { userdata } = require('../models/userdata');
const { signupValidate } = require('../validate/signup');
const { putUserValidate } = require('../validate/put-user');
const { successResponse, errorResponse, bcryptPassword } = require('../common/helpers');
const {
  signupSuccefully,
  emptyMessage,
  noRecordUpdated,
  noRecordFound,
  deletedSuccessfully
} = require('../common/messages');

user.post('/user', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
    try {
      const { error } = signupValidate.validate(req.body);
      if (error) {
        return errorResponse(res, 400, {}, error.details[0].message);
      }
      await connect();
      const user = new userdata({
        username: req.body.username,
        password: [{ password: await bcryptPassword(req.body.password), isDeleted: false }],
        fullname: req.body.fullname,
        contact: req.body.contact,
        email: req.body.email,
        location: req.body.location,
        isDeleted: false
      });
      await user.save();
      return successResponse(
        res,
        true,
        {
          id: user._id,
          username: user.username,
          fullname: user.fullname,
          contact: user.contact,
          email: user.email,
          location: user.location
        },
        signupSuccefully
      );
    } catch (err) {
      return errorResponse(res, 400, {}, err.message);
    }
  })
});

user.get('/user', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const users = await userdata.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $project: {
          _id: 0,
          username: 1,
          id: '$_id',
          fullname: 1,
          contact: 1,
          location: 1,
          email: 1,
          isDeleted: 1
        }
      }
    ]);
    return successResponse(res, true, users, emptyMessage);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

user.put('/user/:id', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    const { error } = putUserValidate.validate(req.body);
    if (error) {
      return errorResponse(res, 400, {}, error.details[0].message);
    }
    await connect();

    const user = await userdata.updateOne(
      {
        _id: req.params.id
      },
      req.body
    );
    return user.nModified > 0
      ? successResponse(res, true, req.body, emptyMessage)
      : successResponse(res, false, req.body, noRecordUpdated);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

user.get('/user/:id', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const user = await userdata.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    return user
      ? successResponse(
          res,
          true,
          {
            username: user.username,
            fullname: user.fullname,
            contact: user.contact,
            email: user.email,
            location: user.location,
            isDeleted: false
          },
          emptyMessage
        )
      : successResponse(res, false, {}, noRecordFound);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

user.delete('/user/:id', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const user = await userdata.updateOne(
      {
        _id: req.params.id
      },
      {
        isDeleted: true
      }
    );
    return user.nModified > 0
      ? successResponse(res, true, {}, deletedSuccessfully)
      : successResponse(res, false, {}, noRecordFound);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});
module.exports = user;

// var passport = require('passport'),
//       FacebookStrategy = require('passport-facebook').Strategy;
//       passport.use(new FacebookStrategy({
//         clientID: '190694478008308',
//         clientSecret: 'b37357c0a2d26f38d2315a0a5206f839',
//         callbackURL: "http://localhost:3000/api/auth/facebook/callback"
//       },
//       function(accessToken, refreshToken, profile, cb) {
//       //   var user = {
//       //     'email': profile.emails[0].value,
//       //     'name' : profile.name.display,
//       //     'id'   : profile.id,
//       //     'token': accessToken
//       // }
  
//       // You can perform any necessary actions with your user at this point,
//       // e.g. internal verification against a users table,
//       // creating new user entries, etc.
  
//       // return done(null, user); 
//        console.log(accessToken, refreshToken,"LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL", profile);
//       }
//     ));
// user.get('/user2/facebook555', async (req, res) => {
//   try {
//     console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLl");
//   } catch (err) {
//     console.log(err);
    
//     return errorResponse(res, 400, {}, err.message);
//   }
// });
// user.get('/auth/facebook/callback',
//   passport.authenticate('facebook', function(err, user, info){ 
//     console.log(err, user, "5555555555555555555555555555555",info);
//    }));
// user.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));