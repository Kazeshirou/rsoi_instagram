var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var passport = require('passport');
var morgan = require('morgan')
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');
var logger = require('./utilities/logger')

mongoose.connect('mongodb://localhost/my_instagramdb', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    logger.info("mongo db connected")
});

mongoose.set('useCreateIndex', true)
mongoose.set('debug', function (coll, method, query, doc, options) {
    let set = {
        coll: coll,
        method: method,
        query: query,
        doc: doc,
        options: options
    };

    logger.info({
        dbQuery: set
    });
});

var app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use(cors({ credentials: true }));

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());

var router = express.Router();

router.route('/')
    .get(authController.isBearerAuthenticated, (req, res) => res.json({ message: "OK" }));

router.route('/login')
    .get(authController.isAuthenticated, (req, res) => res.json({message: "success"}));

router.route('/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers);

router.route('/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);

router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision);

router.route('/oauth2/token')
    .get((req, res) => res.send('time to get token'))
    .put(authController.isClientAuthenticated, oauth2Controller.refreshToken)
    .post(authController.isClientAuthenticated, oauth2Controller.token);




app.use('/api/v1', router);

app.listen(49005);