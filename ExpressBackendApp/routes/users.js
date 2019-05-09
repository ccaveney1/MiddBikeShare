var express = require('express');
var router = express.Router();
const user = require('../models/UserModel');


// Get all users
router.get('/',(req,res) => {
    user.getAllUsers((err, users)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all users. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, users:users},null,2));
            res.end();
    }
    });
});

// Get email by id
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  user.getUserEmailById(id, (err, user) => {
    if(err){
      res.json({success:false, message: `Failed to get the user. Error: ${err}`});
    }
    else {
      res.write(JSON.stringify({success: true, user:user},null,2));
      res.end();
    }
  })
})


// Add user (only if email isn't already in database)
router.post('/', (req,res,next) => {
  let newUser = new user({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      strikes: req.body.strikes,
      admin: false,
  });
  user.getUserByEmail(req.body.email, (err, found_user) => {
    if(err){
      res.json({success:false, message: `Failed to get user. Error: ${err}`});
    }
    else if(found_user){
      res.write(JSON.stringify({success: true, user:found_user, message:'User already in database'},null,2));
      res.end();
    }else{
      user.addUser(newUser,(err, user) => {
        if(err) {
          res.json({success: false, message: `Failed to create a new user. Error: ${err}`});
  
        }
        else{
          res.json({success:true, user:user, message: "Added successfully."});
        }
    });
    }
  })
});


// Manually update user's strikes or update to admin
router.post('/:id', (req,res,next) => {

  let updatedUser;
  let userId = req.params.id;

  //if strikes not specified in body, update is for admin
  if(!req.body.strikes){
      updatedUser = {
        admin: req.body.admin,
      };
  //else update is for strikes
  } else {
      updatedBike = {
          strikes : req.body.strikes,
      };
  }
  user.update(userId, updatedUser,(err, user) => {
      if(err) {
          res.json({success: false, message: `Failed to update user. Error: ${err}`});
      }
      else if(user){
          res.json({success:true, user:user, message: "User updated successfully."});
      }else{
          res.json({success:false});
      }
  });

});


//Delete user
router.delete('/:id', (req,res,next)=> {
//access the parameter which is the id of the item to be deleted
  let id = req.params.id;
  user.deleteUserById(id,(err,user) => {
      if(err) {
          res.json({success:false, message: `Failed to delete the user. Error: ${err}`});
      }
      else if(user) {
          res.json({success:true, message: "Deleted successfully"});
      }
      else
          res.json({success:false});
  })
});

module.exports = router;
