const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function (next) {
    return bcrypt
        .hash(this.password, 10)
        .then(hash => {
            this.password = hash;

            return next();
        })
        .catch(err => {
            return next(err);
        });
});

userSchema.methods.validatePassword = function (passwordGuess) {
    return bcrypt.compare(passwordGuess, this.password);
};


module.exports = mongoose.model('User', userSchema, 'users');