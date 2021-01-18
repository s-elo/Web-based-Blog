const express = require('express');
const Topic = require('../models/topic.js');

const router = express.Router();

router.get('/post', function(req, res) {
	res.render('topic/post.html', {
		user: req.session.user
	});
});
router.post('/post', function(req, res) {
	console.log(req.body);
	console.log(req.session.user);
	// Topic.remove({
	// 	title: 'test1'
	// }, function(err, ret) {
	// 	if (err) {
	// 		throw err;
	// 	}
	// 	console.log('deleted');
	// });
	var recData = req.body;
	recData.email = req.session.user.email;
	recData.nickName = req.session.user.nickName;
	
	new Topic(recData).save(function(err, data) {
		if (err) {
			return res.status(500).send('server error!');
		}
		res.redirect('/');
	});
});

router.get('/comment', function(req, res) {
	//console.log(req.query);
	var id = req.query.id.replace(/"/g, '');
	
	//find the topic by Id
	Topic.findOne({
		_id: id
	}, function(err, data) {
		if (err) {
			return res.status(500).send('server error!');
		}
		//console.log(data)
		res.render('topic/comment.html', { 
			topic: data,
			user: req.session.user
		});
	});
});
module.exports = router;
