var mongoose = require('mongoose');
const Comment = require('./comment');

// SCHEMA SETUP
var bakerSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

bakerSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});

module.exports = mongoose.model("Baker", bakerSchema);
