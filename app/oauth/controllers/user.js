var path = require('path');
var User = require(path.join(__dirname, '../models/user'));

function postUsers(req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    
    user.save((err) => {
        if (err) {
            return res.send(err);
        }

        return res.json({ user:  user });
    });
};

function getUsers(req, res) {
    User.find((err, users) => {
        if (err){
            return res.send(err);
    }
        res.json(users);
    });
};

module.exports = {
    postUsers,
    getUsers
}