//requireds
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport    = require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var port        = process.env.PORT || 8080;
var cors        = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 8080 for sim ???  should I use 3000?
var jwt         = require('jwt-simple');

//REST - not using sessions, using JSON Web Token
//app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../www/'));


// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//logger to console
app.use(morgan('dev'));

//CORS
app.use(cors())

// Use passport
app.use(passport.initialize());

//use cookie parser
app.use(cookieParser());

//CORS headers so client can access data
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

app.use(allowCrossDomain);

//twilio routing
app.use('/', require('./routes/index'));

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
//  res.send('Ciao yall! API is: http://localhost:' + port + '/api');
  res.sendFile('index.html', {
    root: __dirname +'/../www/'
  });
});

//connect and require passport
mongoose.connect(config.database);

require('./config/passport')(passport);

//bundle routes
var apiRoutes = express.Router();

//create new user
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({succes: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    //save user
    newUser.save(function(err) {
      if (err) {
        res.json({succes: false, msg: 'Username already exists.'});
      } else {
        res.json({succes: true, msg: 'Successful created user!'});
      }
    });
  }
});

//verify user
apiRoutes.post('/authenticate', function(req, res) {
  console.log(' line 90',  req.body)
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

//restricted info - member info - restricted - protected endpoint
// First check if user is allowed to see this info - add passport and jwt to this route
//extract from JWT and decode - send grreting to member verifying information
apiRoutes.get('/memberinfo', passport.authenticate('jwt', {session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        res.json({success: true, msg: 'Welcome ' + user.name + '!  Thanks for signing up for my app: Yoga-on-the-Go-with-Ti and sharing the yoga love!  I look forward to practicing with you.  Please watch the video below to learn how to use my app, or go striaght to it by hitting the Enter App button.  Feel welcome to contact me with any questions or concerns.  Love and light to you, ' + user.name + '.  Namaste!'});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

//connect api routes under /api
app.use('/api', apiRoutes);

// Start server
app.listen(port);
console.log('Namaste!  You are on: http://localhost:' + port);

//export
module.exports = app;
