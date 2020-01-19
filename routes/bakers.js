var express = require("express");
var router = express.Router();
var Baker = require("../models/baker");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// =============
// BAKER ROUTE
// =============

// INDEX ROUTE- SHOW ALL CAMPGROUDS
router.get("/", function(req, res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Baker.find({name: regex}, function(err, allBakers){
		if(err){
			console.log(err);
		} else {
			
			if(allBakers.length < 1){
				req.flash("error", "Bakery not found");
				return res.redirect("back");
			}
			res.render("bakers/index", {bakers:  allBakers, page: 'bakers'});
		}
	  });
	} else {
		Baker.find({}, function(err, allBakers){
		if(err){
			console.log(err);
		} else {
			res.render("bakers/index", {bakers:  allBakers, page: 'bakers'});
		}
	  });
	}
});

// NEW ROUTE- SHOW THE FORM TO CREATE A NEW BAKERY
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("bakers/new");
});

// CREATE ROUTE- ADD NEW BAKERY TO THE DATABASE
router.post("/", middleware.isLoggedIn, function(req, res){
	console.log("req.body::");	
	console.log(req.body);
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
	  console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
	}
    
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
	var newBakers = {name: name, image: image, description: description, author: author,  location: location, lat: lat, lng: lng};
	console.log("newBakers::");
	console.log(newBakers);
// 	Create a new bakery and save to DB
	Baker.create(newBakers, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("/bakers");
		}
	});
  });
});
// SHOW ROUTE
router.get("/:id", function(req, res){
// 	FIND THE BAKERY WITH PROVIDED ID
	Baker.findById(req.params.id).populate("comments").exec(function(err, foundBaker) {
		if(err || !foundBaker) {
			req.flash("error", "Bakery not found");
			res.redirect("back");
		} else {
			console.log(foundBaker);
// 			render the show template with the bakery
			res.render("bakers/show", {baker: foundBaker});
		}
	});
});

// EDIT BAKER ROUTE
router.get("/:id/edit",middleware.checkBakeryOwnership, function(req, res){
	Baker.findById(req.params.id, function(err, foundBaker){
		res.render("bakers/edit", {baker: foundBaker});
	});
});

// UPDATE BAKER ROUTE
router.put("/:id",middleware.checkBakeryOwnership, function(req,res){
	Baker.findByIdAndUpdate(req.params.id, req.body.baker, function(err, updatedBaker){
		if(err){
			res.redirect("/baker");
		} else {
			res.redirect("/bakers/" + req.params.id)
		}
	})
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkBakeryOwnership, function(req, res){
	Baker.findByIdAndRemove(req.params.id, function(err){
		if(err){
			re.redirect("/bakers");
		} else {
			res.redirect("/bakers");
		}
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;