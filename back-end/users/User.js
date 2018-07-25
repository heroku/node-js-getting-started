const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

SALT_ROUNDS = 11;

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
    console.log("stsring")
    bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
        if (err) {
            console.log(err.message)
            return
        }
        this.password = hash;
        next();
    })
});

userSchema.methods.validatePassword = function (passwordGuess) {
    console.log("PASS", this.password)
    return bcrypt.compare(passwordGuess, this.password)

}


// userSchema.pre('create', function (next) {

// var user = this;
// if (this.isModified('password') || this.isNew) {
//     bcrypt.genSalt(this.password, null, function (err, SALT_ROUNDS) {
//         if (err) {
//             return next(err);
//         }
//         bcrypt.hash(user.password, SALT_ROUNDS, null, function (err, hash) {
//             if (err) {
//                 return next(err);
//             }
//             user.password = hash;
//             next();
//         });
//     });
// } else {
//     return next();
// }
//     });

// userSchema.methods.validatePassword = function (passw, cb) {
//     bcrypt.compareSync(this.password, hash, function(err, isMatch) {
//         if (err) {
//             return cb(err);
//         }
//         cb(null, isMatch);
//     });
//}
// userSchema.methods.validatePassword = function (passwordGuess) {
//      bcrypt.compare(passwordGuess, this.password)
//         .then((isMatch) => {
//             if( isMatch) {
//                 res.status(201).json( { message: "Login Successful!", isMatch})
//         } else {
//             return res.status(404).json({message: "User not found!"})

//         }
//         }).catch(err => {
//             res.status(500).json({ errorMessage: "Your entry could not be retrieved", err })
//         })
// }



// userSchema.methods.validatePassword = function (passwordGuess, res){
//     bcrypt.compare(passwordGuess, this.password, res)
//     .then(isMatch => {
//         if (isMatch) {
//            res.status(201).json(isMatch)
//         } else {
//             return res.status(404).json({ errorMessage: "Passwords dont match!" })
//         }})
//         .catch (err => {
//         res.status(500).json({ errorMessage: "User not found", err })
//     })};






module.exports = mongoose.model('User', userSchema, 'users');