var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
    value: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    clientId: { type: String, required: true },
    expiration: { type: Date, required: true },
    refreshToken: { type: String, required: true },
    refreshTokenExpiration: {type: Date, required: true}
});

module.exports = mongoose.model('Token', TokenSchema);