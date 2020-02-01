// require dotenv at the top
require('dotenv').config();

var express = require("express"),
 	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require('mongoose'),
	flash    = require("connect-flash"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Baker = require("./models/baker"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

// requiring routes
var commentRoutes = require("./routes/comments"),
    bakerRoutes = require("./routes/bakers"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/cakes_supermarket_v2",  { useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); seed the database
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Bakers are artists",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/bakers/:id/comments", commentRoutes);
app.use("/bakers", bakerRoutes);

app.listen(6000, function(){
	console.log("server is listening!")
});
