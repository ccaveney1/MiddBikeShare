//Require Mongoose
var mongoose = require('mongoose');

var User = require('../models/UserModel')
var Bike = require('../models/BikeModel')


//Define a schema
var Schema = mongoose.Schema;

var RentalInstanceSchema = new Schema({
    user              : { type: Schema.Types.ObjectId, ref: 'User' },
    bike              : { type: Schema.Types.ObjectId, ref: 'Bike' },
    startLatitude     : {type: Number},
    startLongitude    : {type: Number},
    endLatitude       : {type: Number},
    endLongitude      : {type: Number},
    // startLocation     : { 
    //                     lat: { type: Number },
    //                     long: { type: Number }
    //                     },
    // endLocation       : { 
    //                     lat: { type: Number },
    //                     long: { type: Number }
    //                     },
    startTime         : { type: Date },
    endTime           : { type: Date },
    reportDamaged     : { type: Boolean },
    reportMissing     : { type: Boolean },
    index             : { type: Number },
});



//Export function to create "RentalInstance" model class
Rental = module.exports = mongoose.model('RentalInstance', RentalInstanceSchema );

//Finds all rental instances
module.exports.getAllRentals = (callback) => {
    Rental.find(callback);
}

//Find a rental instance by id
module.exports.getRentalById = (id, callback) => {
    Rental.findById(id, callback);
}

//Add a rental instance
module.exports.addRental = (newRental, callback) => {
    newRental.save(callback);
}

//Remove a user with ID
module.exports.deleteRentalById = (id, callback) => {
    let query = {_id: id};
    Rental.remove(query, callback);
}

//Update a rental with ID
module.exports.update = (id, updatedRental, callback) => {
    let query = {_id: id};
    Rental.findByIdAndUpdate(query, updatedRental, {new: true}, callback);
}