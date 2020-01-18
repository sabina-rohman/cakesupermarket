// Error driven development
var mongoose = require("mongoose");
var Baker = require("./models/baker");
var Comment = require("./models/comment");

var data = [
	{
	 name: "Patteserie Valerie",
	 image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1226&q=80",
	 description: "Baked goods have been around for thousands of years. The art of baking was developed early during the Roman Empire. It was a highly famous art as Roman citizens loved baked goods and demanded for them frequently for important occasions such as feasts and weddings etc."
	},
	{
	 name: "Crossaint Box",
	 image: "https://images.unsplash.com/photo-1477763858572-cda7deaa9bc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1276&q=80",
	 description: "Baked goods have been around for thousands of years. The art of baking was developed early during the Roman Empire. It was a highly famous art as Roman citizens loved baked goods and demanded for them frequently for important occasions such as feasts and weddings etc."
	},
	{
	 name: "Bakes and Shakes",
	 image:"https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1272&q=80",
	 description: "Baked goods have been around for thousands of years. The art of baking was developed early during the Roman Empire. It was a highly famous art as Roman citizens loved baked goods and demanded for them frequently for important occasions such as feasts and weddings etc."
	}
];

function seedDB(){
// 	Remove all bakeries
	Baker.remove({}, function(err){
	// 	if(err){
	// 		console.log(err);
	// 	} 
	// 	console.log("Bakery Removed!");
	// 	// 	add few bakeries
	// 	data.forEach(function(seed){
	// 		Baker.create(seed, function(err, bakery){
	// 			if(err){
	// 				console.log(err);
	// 			} else {
	// 				console.log("added a bakery");
	// //Create a comment
	// 				Comment.create(
	// 					{
	// 						text: "This place is great, but I wish there was internet",
	// 						author: "Homer"
	// 					}, function(err, comment){
	// 						if(err){
	// 							console.log(err);
	// 						} else {
	// 							bakery.comments.push(comment);
	// 							bakery.save();
	// 							console.log("Created new comment");
	// 						}
	// 					});
	// 			}
	// 		});
	// 	});
	});
 }

module.exports = seedDB;