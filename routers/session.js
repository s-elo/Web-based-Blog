const express = require('express');
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const md5 = require('blueimp-md5');

const router = express.Router();

//home page
router.get('/', function(req, res) {
	// User.remove({
	// 	email: 'zz321yy@qq.com'
	// }, function(err, ret) {
	// 	if (err) {
	// 		throw err;
	// 	}
	// 	console.log('deleted');
	// });
	// console.log(req.session.user)
	// if (req.session.user != undefined) { 
	// 	var data = req.session.user;
	// }
	// else {
	// 	var data = 0;
	// }
	//console.log(req.session.topic)
	
	//find all the topics
	Topic.find(function(err, topicArray) {
		if (err) {
			return res.status(500).send('server error!');
		}
		//console.log(topicArray)//[{},{},{}]
		//put the latest one at the top
		topicArray = topicArray.reverse();
		res.render('index.html', {
			user: req.session.user,
			topic: topicArray
		});
	});
});

//login
router.get('/login', function(req, res) {
	res.render('login.html');
});

router.post('/login', function(req, res) {
	console.log(req.body);
	var recData = req.body;
	
	recData.password = md5(md5(recData.password));
	//check if the email or password correct
	User.findOne({
		email: recData.email,
		password: recData.password
	}, function(err, data) {
		if (err) {
			return res.status(500).json({
				errCode: 2,
				message: 'server error!'
			});
		}
		if (data) {
			req.session.user = data;
			
			return res.status(200).json({
				errCode: 0,
				message: 'login successfully'
			});
		}
		else {
			return res.status(200).json({
				errCode: 1,
				message: 'Email or password is wrong!'
			});
		}
	});
});

//register
router.get('/register', function(req, res) {
	res.render('register.html');
});

router.post('/register', function(req, res) {
	console.log(req.body);
	var recData = req.body;
	
	//check if it has been signed in
	User.findOne({
		//or relation
		$or: [
			{
				email: recData.email
			},
			{
				nickName: recData.nickName
			}
		]
	}, function(err, data) {
		if (err) {
			//return res.status(500).send('error');
			return res.status(500).json({
				errCode: 2,
				message: 'Server error'
			});
		}
		//console.log(data);
		//if already exsited
		if (data) {
			//return res.status(200).send('already exsited');
			return res.status(200).json({
				errCode: 1,
				message: 'Email or nickName already exsited'
			});
		}
		
		//password encryption twice
		recData.password = md5(md5(recData.password));
		
		//add a new user
		new User(recData).save(function(err, user) {
			if (err) {
				//return res.status(500).send('error');
				return res.status(500).json({
					errCode: 2,
					message: 'Server error'
				});
			}
			
			//save the data in session
			req.session.user = user;
			
			//return res.status(200).send('success');
			return res.status(200).json({
				errCode: 0,
				message: 'Success!'
			});
			//note that the redirection can be used only in synchrous submition
			//thus need client-side to redirect
		});
	});
});

//login out
router.get('/loginOut', function(req, res) {
	req.session.user = null;
	res.redirect('/');
});

module.exports = router;
