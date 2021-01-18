const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogUsers', 
				 {useNewUrlParser: true, useUnifiedTopology: true});
				 
var schema = mongoose.Schema;

var userSchema = new schema({
	email: {
		type: String,
		required: true
	},
	nickName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createTime: {
		type: Date,
		//do not use Date.now()
		default: Date.now
	},
	lastModifiedTime: {
		type: Date,
		//do not use Date.now()
		default: Date.now
	},
	avatar: {
		type: String,
		default: '/public/img/profile.jpg'
	},
	bio: {
		type: String,
		default: ''
	},
	gender: {
		type: Number,
		/**
		 * -1: secret
		 * 0: male
		 * 1: female
		 */
		enum: [-1, 0, 1],
		default: -1
	},
	birthday: {
		type: Date
	},
	status: {
		type: Number,
		/**
		 * 0: normal
		 * 1: restrict to comment
		 * 2: restrict to login
		 */
		enum: [0, 1, 2],
		default: 0
	}
});

module.exports = mongoose.model('User', userSchema);


