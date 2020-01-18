var express = require("express");
var router = express.Router({mergeParams: true});
var Baker = require("../models/baker");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ================
//  COMMENT ROUTE
// ================

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
	Baker.findById(req.params.id, function(err, foundBaker){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {baker: foundBaker});
		}
	})
});

// CREATE COMMENTS ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
// 	look up bakery using ID
	Baker.findById(req.params.id, function(err, baker){
		if(err){
			console.log(err);
			res.redirect("/bakers");
		} else{
// 			create new comment
// 			req.body.comment is pre-made object
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
// 					add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
// 					save comment
					comment.save();
					console.log(comment);
// 					connect new comment to bakery
					baker.comments.push(comment);
// 					save the bakery
					baker.save();
					req.flash("success", "Successfully added comment");
// 					redirect to show page
					res.redirect("/bakers/" + baker._id);
				}
			});
		}
	})
})


// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {baker_id: req.params.id, comment: foundComment});
		}
	})
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,comment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/bakers/" + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/bakers/" + req.params.id)
		}
	})
});

module.exports = router;