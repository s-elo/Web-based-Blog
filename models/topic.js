const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogUsers', 
				 {useNewUrlParser: true, useUnifiedTopology: true});
				 
var topicSchema = new mongoose.Schema({
	title: {
		type: String,
		default: 'No title'
	},
	content: {
		type: String,
		required: true
	},
	postTime: {
		type: Date,
		default: Date.now
	},
	attention: {
		type: Number,
		default: 0
	},
	email: {
		type: String,
		required: true
	},
	nickName: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Topic', topicSchema);
