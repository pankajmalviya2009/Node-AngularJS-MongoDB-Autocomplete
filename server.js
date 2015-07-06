// modules set up=================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');			// mongoose for mongodb
var bodyParser     = require('body-parser');		// pull information from HTML POST (bodyparser + json + urlencoder)
var methodOverride = require('method-override');	// simulate DELETE and PUT 
var morgan 		   = require('morgan'); 			// log requests to the console 

// configuration ===========================================
var config = require('./config.js');
// connect to our mongoDB database 

mongoose.connect(config.database, function(err){
    if(err){
        console.log(err);
    } else {
        console.log('connected to the database');
    }
});

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); 									// parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); 			// parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// listen (start app with node server.js) ======================================
app.listen(config.port, function(err){
    if(err){
        console.log(err);
    } else {
        console.log("App Listening on port "+ config.port);
    }
});

exports = module.exports = app; 						// expose app