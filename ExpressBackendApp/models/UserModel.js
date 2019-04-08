//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name        : { type: String },
  last_name         : { type: String },
  email             : { type: String },
  strikes           : { type: Number },
});

// Virtual for user's full name
UserSchema
.virtual('name')
.get(function () {
  return this.first_name + ' ' + this.last_name;
});

//Virtual for username
UserSchema
.virtual('username')
.get(function() {
    return this.email.split("@").pop();
})

UserSchema.methods.toUserJSONFor = function(user){
    return {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        strikes: this.strikes
    };
};


//Export function to create "User" model class
const User = module.exports = mongoose.model('User', UserSchema );

//Finds all users
module.exports.getAllUsers = (callback) => {
    User.find(callback);
}

//Find a user and return email
module.exports.getUserEmailById = (id, callback) => {
    User.findById(id, 'email', callback);
}

//Add a user
module.exports.addUser = (newUser, callback) => {
    newUser.save(callback);
}

//Remove a user with ID
module.exports.deleteUserById = (id, callback) => {
    let query = {_id: id};
    User.remove(query, callback);
}

//Find a user by email
module.exports.getUserByEmail = (email, callback) => {
    User.findOne({email: email}, callback);
}

