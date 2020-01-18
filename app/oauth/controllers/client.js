var Client = require('../models/client');

function postClients(req, res) {
    var client = new Client();

    client.name = req.body.name;
    client.id = req.body.id;
    client.secret = req.body.secret;
    client.userId = req.user._id;

    client.save(function (err) {
        if (err)
            return res.send(err);

        res.json({ client: client });
    });
};

function getClients(req, res) {
    Client.find({ userId: req.user._id }, (err, clients) => {
        if (err){
            return res.send(err);
        }

        res.json(clients);
    });
};

module.exports = {
    postClients,
    getClients
}