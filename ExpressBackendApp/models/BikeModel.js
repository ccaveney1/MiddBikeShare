//Require Mongoose
var mongoose = require('mongoose');

var User = require('../models/UserModel')

//Define a schema
var Schema = mongoose.Schema;

var BikeSchema = new Schema({
  status              : {
                        type: String,
                        enum: ['Available', 'Damaged', 'Missing', 'Rented'],
                        },
  currentLatitude     : {type: Number},
  currentLongitude    : {type: Number},
  currentUser         : { type: Schema.Types.ObjectId, ref: 'User' },
  label               : { type: Number}
});


//Export function to create "Bike" model class
const Bike = module.exports = mongoose.model('Bike', BikeSchema );

//Finds all bikes
module.exports.getAllBikes = (callback) => {
  Bike.find(callback);
}

//Find a bike with ID
module.exports.getBikeById = (id, callback) => {
  Bike.findById(id, callback);
}

//Add a bike
module.exports.addBike = (newBike, callback) => {
  newBike.save(callback);
}

//Remove a bike with ID
module.exports.deleteBikeById = (id, callback) => {
  let query = {_id: id};
  Bike.remove(query, callback);
}


//Update bike with ID
module.exports.update = (id, updatedBike, callback) => {
  let query = {_id: id};
  Bike.findByIdAndUpdate(query, updatedBike, {new: true}, callback);
}