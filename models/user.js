var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    city: String,
    registrationdate: Date,
    lastLoginDate: Date,
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);