const passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var bcrypt = require('bcrypt-nodejs');

var TokenSchema = new mongoose.Schema({
    value: { type: String, required: true },
    userId: { type: String, required: true },
    expiration: { type: Date, required: true }
});

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
                console.log("hash error", err)
                return callback(err);
            }
            user.password = hash;
            return callback();
        });
    });
});

UserSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

var Token = mongoose.model('TelescopesToken', TokenSchema);
var User = mongoose.model('TelescopesUser', UserSchema);
var user = new User({
    username: 'telescopes',
    password: '123456'
});

user.save((err) => {
    if (err) {
        throw err;
    }
});

passport.use(new BearerStrategy(
    (accessToken, callback) => {
        console.log(accessToken)
        Token.findOne({ value: accessToken }, (err, token) => {
            if (err) {
                return callback(err);
            }

            if (!token) { return callback(null, false); }
            console.log("Token founded")
            if (token.expiration <= Date.now()) {
                console.log("Token expirated")
                return callback(null, false);
            }

            User.findOne({ _id: token.userId }, (err, user) => {
                if (err) { return callback(err); }

                if (!user) { return callback(null, false); }

                callback(null, user, { scope: '*' });
            });
        });
    }
));

passport.use(new BasicStrategy(
    (username, password, callback) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return callback(err);
            }

            if (!user) {
                return callback(null, false);
            }

            user.verifyPassword(password, (err, isMatch) => {
                if (err) {
                    return callback(err);
                }

                if (!isMatch) {
                    return callback(null, false);
                }

                return callback(null, user);
            });
        });
    }
));

function generateToken(userId) {
    return new Promise((resolve, reject) => {
        var token = new Token({
            value: uid(256),
            userId: userId,
            expiration: Date.now() + 1 * 60 * 1e3, // 30 секунд
        });

        token.save((err) => {
            if (err) {
                return reject(err);
            }
            resolve(token);
        });
    });
}

function uid(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    generateToken: generateToken,
    isAuthenticated: passport.authenticate('basic', { session: false }),
    isBearerAuthenticated: passport.authenticate('bearer', { session: false })
}