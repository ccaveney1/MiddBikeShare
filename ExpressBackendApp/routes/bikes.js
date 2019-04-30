var express = require('express');
var router = express.Router();
const bike = require('../models/BikeModel');


// Get all bikes
router.get('/',(req,res) => {
    bike.getAllBikes((err, bikes)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all bikes. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, bikes:bikes},null,2));
            res.end();
    }
    });
});

// Get bike by id
router.get('/:id',(req,res,next) => {
    let id = req.params.id;
    bike.getBikeById(id, (err, bike)=> {
        if(err) {
            res.json({success:false, message: `Failed to load bike. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, bike:bike},null,2));
            res.end();
    }
    });
});


// Add bike
router.post('/', (req,res,next) => {
  let newBike = new bike({
      status: req.body.status,
      currentLatitude: req.body.currentLatitude,
      currentLongitude: req.body.currentLongitude,
      currentUser: null,
      label: req.body.label,
  });
  bike.addBike(newBike,(err, bike) => {
      if(err) {
          res.json({success: false, message: `Failed to create a new bike. Error: ${err}`});

      }
      else if(bike){
        res.json({success:true, bike:bike, message: "Added successfully."});
      }else{
          res.json({success:false});
      }
  });
});

// Manually update a bike's location, user, or status
router.post('/:id', (req,res,next) => {

    let updatedBike;
    let bikeId = req.params.id;

    //if currentLocation not specified in body
    if(!req.body.currentLongitude){
        //if neither currentUser nor location not specified in body
        if(!req.body.currentUser){
            //update is for status
            updatedBike = {
                status: req.body.status,
            };
        //if neither currentLocation nor status specified in body
        } else if(!req.body.status){
            //update is for currentUser
            updatedBike = {
                currentUser: req.body.currentUser,
            };
        }
        //else update is for currentLocation
    } else {
        updatedBike = {
            currentLongitude: req.body.currentLongitude,
            currentLatitude: req.body.currentLatitude,
        };
    }
    bike.update(bikeId, updatedBike,(err, bike) => {
        if(err) {
            res.json({success: false, message: `Failed to update bike. Error: ${err}`});
        }
        else if(bike){
            res.json({success:true, bike:bike, message: "Bike updated successfully."});
        }else{
            res.json({success:false});
        }
    });

  });

//Delete bike
router.delete('/:id', (req,res,next)=> {
  let id = req.params.id;
  bike.deleteBikeById(id,(err,bike) => {
      if(err) {
          res.json({success:false, message: `Failed to delete the bike. Error: ${err}`});
      }
      else if(bike) {
          res.json({success:true, message: "Deleted successfully"});
      }
      else
          res.json({success:false});
  })
});

module.exports = router;
