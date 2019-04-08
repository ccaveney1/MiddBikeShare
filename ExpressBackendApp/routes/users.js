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

// Get user by email
//router.get('/email', (req, res, next) => {
//   let email = req.body.email;
//   user.getUserByEmail(email, (err, user) => {
//     if(err){
//       res.json({success:false, message: `Failed to get user. Error: ${err}`});
//     }
//     else{
//       res.write(JSON.stringify({success: true, user:user},null,2));
//       res.end();
//     }
//   })
// })

// Add user
router.post('/', (req,res,next) => {
  let newUser = new user({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      strikes: req.body.strikes
  });
  user.addUser(newUser,(err, user) => {
      if(err) {
          res.json({success: false, message: `Failed to create a new user. Error: ${err}`});

      }
      else{
        res.json({success:true, user:user, message: "Added successfully."});f
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
