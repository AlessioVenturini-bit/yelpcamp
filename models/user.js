const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
// ! You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.Additionally Passport-Local Mongoose adds some methods to your Schema.

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)