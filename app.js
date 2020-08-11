//Using Beejay's Boiler Plate

//load configuration
require('dotenv').config()

//require 
var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , glob = require('glob')
  , path = require('path')
  , port = process.env.WEB_PORT
  , mongoose = require('mongoose')
  , models = {}
  , passport = require('passport')
  , morgan = require('morgan')
  , mongo_uri = process.env.DB_URL + process.env.DB_NAME
  , winston = require('winston')
  , log_path = process.env.LOG_PATH
  , rfs = require('rotating-file-stream')
  , jwt = require('jsonwebtoken')

const connectEnsureLogin = require('connect-ensure-login');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

//setup loggers: Morgan for HTTP requests, winston for normal logs
//defaults to current path if no LOG_PATH is defined
if (!log_path) {
  log_path = path.join(__dirname, 'log')
} else {
  var fs = require('fs');
  var dir = log_path;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
var accessLogStream = rfs.createStream('libsystem.log', { //rotating file stream
  interval: '1d', // rotate daily
  path: log_path
})

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: log_path })
  ]
});

app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev', {}))

app.set('view engine', 'pug') //set view engine to pug
app.set('views', __dirname + '/web/web_views') //set where the views are
app.use(express.static(__dirname + '/web/assets')); //set where the assets are stored
app.use(passport.initialize());
app.use(passport.session());
//set JSON for POST body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (error, req, res, next) {
  //Catch json error
  res.json({ "Error": error });
});


//mongodb and mongoose initialization
const connection = mongoose.connection
mongoose.set('debug', true);
mongoose.connect(mongo_uri, { useUnifiedTopology: true, useNewUrlParser: true })


//Load every models controller available into our models object
glob.sync(__dirname + '/data_controllers/*.js').forEach(function (file) {
  require(path.resolve(file))(mongoose, models, logger);
});

connection.once('open', function () {

  logger.info("MongoDB database connection established successfully");

  // //following loads all sample data COMMENT WHEN IN PRODUCTION OR JUST REMOVE
  // require(  __dirname +'/data_controllers/data_loaders/data_sample.js' )(models);

})

passport.use(models.Users.createStrategy());
passport.serializeUser(models.Users.serializeUser());
passport.deserializeUser(models.Users.deserializeUser());
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_TOKEN
},
  function (jwtPayload, cb) {
    return models.Users.findById(jwtPayload.id)
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
  }
));

//Load every web controller available
glob.sync(__dirname + '/web/web_controllers/*.js').forEach(function (file) {
  require(path.resolve(file))(app, models, passport, jwt, connectEnsureLogin, logger);
});


app.listen(port);


