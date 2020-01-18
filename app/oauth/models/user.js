var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function (callback) {
    console.log('prt')
    var user = this;

    if (!user.isModified('password')) {
        console.log("!user.isModified")
        return callback();
    }

    console.log("user.isModified")
    return bcrypt.genSalt(5, function (err, salt) {
        if (err) {
            return callback(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            console.log("hash")
            if (err) {
                console.log("hash error",err)
                return callback(err);
            }
            user.password = hash;
            return callback();
        });
    });
});

UserSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password,  (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);