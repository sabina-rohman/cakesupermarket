var Baker = require("../models/baker");
var Comment = require("../models/comment");

// all the middlewares goes here
var middlewareObj = {};

middlewareObj.checkBakeryOwnership = function(req, res, next) {
	// 	is user logged in?
	if(req.isAuthenticated()){
		Baker.findById(req.params.id, function(err, foundBaker){
		if(err || !foundBaker){
			req.flash("error", "Bakery not found");
			res.redirect("back");
		} else {
			//does the user owns the bakery?
			if(foundBaker.author.id.equals(req.user._id) || req.user.isAdmin){
			   next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
			}
		}
	});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	// 	is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
// 			does the user owns the comment?
			if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
			   next();
			} else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
			}
		}
	});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj