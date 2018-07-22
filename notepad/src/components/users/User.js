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

userSchema.pre('create', function (next) {
    return bcrypt
        .hash(this.password, 11)
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


// userSchema.methods.checkPassword = function (passwordGuess, callBack) {
//     bcrypt.compare(passwordGuess, this.password)
//         .then(hashMatch => {
//             callBack(hashMatch)
//         })
//         .catch(err => {
//             console.log(err);
//         })
// };




module.exports = mongoose.model('User', userSchema, 'users');