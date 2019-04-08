var express = require('express');
var router = express.Router();
const rental = require('../models/RentalInstanceModel');
const bike = require('../models/BikeModel');





// Get all rental instances
router.get('/',(req,res) => {
    rental.getAllRentals((err, rentals)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all rental instances. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, rentals:rentals},null,2));
            res.end();
    }
    });
});

// Get rental by id
router.get('/:id',(req,res,next) => {
    let id = req.params.id;
    rental.getRentalById(id, (err, rental)=> {
        if(err) {
            res.json({success:false, message: `Failed to load rental instance. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, rental:rental},null,2));
            res.end();
    }
    });
});



// Add rental instance
router.post('/', (req,res,next) => {
    let newRental = new rental({
        user: req.body.user,
        bike: req.body.bike,
        startLocation: req.body.startLocation,
        endLocation: null,
        startTime: Date.now(),
        endTime: null,
        reportDamaged: req.body.reportDamaged,
        reportMissing: req.body.reportMissing,
        index: null
    });
    let bikeId = req.body.bike;
    let updatedBike;
    if(req.body.reportDamaged){
        updatedBike = {
            currentUser:req.body.user,
            status: 'Damaged'
        };
    }else if(req.body.reportMissing){
        updatedBike = {
            currentUser:req.body.user,
            status: 'Missing'
        };
    }else{
        updatedBike = {
            currentUser:req.body.user,
            status: 'Rented'
        };
    }
  
    rental.addRental(newRental,(err, rental) => {
        if(err) {
            res.json({success: false, message: `Failed to create a new rental instance. Error: ${err}`});
        }
        else if(rental){
            bike.update(bikeId, updatedBike,(err, bike) => {
            if(err) {
                res.json({success: false, message: `Failed to update bike's current user. Error: ${err}`});
            }
            else if(bike){
                res.json({success:true, rental:rental, message: "Added successfully."});
            }else{
                res.json({success:false});
            }
            });
        }else{
            res.json({success:false});
        }
    });
  
});

//Update a rental instance (to completed or damaged during rental)
router.post('/:id', (req,res,next) => {
    let rentalId = req.params.id;
    let updatedRental = {
        endLocation: req.body.endLocation,
        endTime: Date.now(),
        reportDamaged: req.body.reportDamaged,
    };
    let bikeId = req.body.bike;
    let updatedBike;
    if(req.body.reportDamaged){
        updatedBike = {
            currentLocation:req.body.endLocation,
            status: 'Damaged'
        };
    }else{
        updatedBike = {
            currentLocation:req.body.endLocation,
            status: 'Available'
        };
    }
  
    rental.update(rentalId, updatedRental,(err, rental) => {
        if(err) {
            res.json({success: false, message: `Failed to update rental instance. Error: ${err}`});
        }
        else if(rental){
            bike.update(bikeId, updatedBike,(err, bike) => {
            if(err) {
                res.json({success: false, message: `Failed to update bike's current location/status. Error: ${err}`});
            }
            else if(bike){
                res.json({success:true, rental:rental, message: "Updated rental instance successfully."});
            }else{
                res.json({success:false});
            }
            });
        }else{
            res.json({success:false});
        }
    });
  
});

//Delete rental instance
router.delete('/:id', (req,res,next)=> {
//access the parameter which is the id of the item to be deleted
  let id = req.params.id;
  rental.deleteRentalById(id,(err,rental) => {
      if(err) {
          res.json({success:false, message: `Failed to delete the rental instance. Error: ${err}`});
      }
      else if(rental) {
          res.json({success:true, message: "Deleted successfully"});
      }
      else
          res.json({success:false});
  })
});

module.exports = router;
