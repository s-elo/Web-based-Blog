const express = require('express');
const User = require('../models/user.js');
const md5 = require('blueimp-md5');
const multer  = require('multer');
const fs = require('fs');

const router = express.Router();

//settings
router.get('/settings/basicInfo', function(req, res) {
	res.render('settings/basicInfo.html', {
		path: req.session.user.avatar,
		user: req.session.user
	});
});

router.post('/settings/basicInfo', function(req, res) {
	console.log(req.body);
	console.log(req.session.user)
	var data = req.body;
	
	req.session.user.gender = data.gender;
	User.findByIdAndUpdate(req.session.user._id, {
		gender: data.gender
	}, function(err, ret) {
		if (err) return console.error(err);
	})
	
	if (data.nickName != '') {
		req.session.user.nickName = data.nickName;
		User.findByIdAndUpdate(req.session.user._id, {
			nickName: data.nickName
		}, function(err, ret) {
			if (err) return console.error(err);
		})
	}
	
	if (data.bio != '') {
		req.session.user.bio = data.bio;
		User.findByIdAndUpdate(req.session.user._id, {
			bio: data.bio
		}, function(err, ret) {
			if (err) return console.error(err);
		})
	}
	
	if (data.birthday != '') {
		req.session.user.birthday = data.birthday;
		User.findByIdAndUpdate(req.session.user._id, {
			birthday: data.birthday
		}, function(err, ret) {
			if (err) return console.error(err);
		})
	}
	
	
	res.redirect('/');
});

//avatar
	
router.post('/avatar', multer().single('img'), function(req, res) {
	console.log(req.file);
	let fileName = (new Date()).getTime() 
					+ parseInt(Math.random()*3435) 
					+ parseInt(Math.random()*6575);
	let fileType = req.file.mimetype.split('/')[1];
	
	let imgPath = `../public/img/${fileName}.${fileType}`;
	fs.writeFile(`./public/img/${fileName}.${fileType}`, req.file.buffer, (data)=>{
	    if(data) {
	        res.send({
				err:0,
				msg:"failed"
			});
	    }
		else {
			req.session.user.avatar = imgPath;
			User.findByIdAndUpdate(req.session.user._id, {
				avatar: imgPath
			}, function(err, ret) {
				if (err) return console.error(err);
			})
	        res.send({
				err:1,
				msg:"succeed",
				imgPath:imgPath
			});
	    }    
	})
})

router.get('/settings/accountSetting', function(req, res) {
	res.render('settings/accountSetting.html', {
		user: req.session.user
	});
});

router.post('/settings/accountSetting', function(req, res) {
	console.log(req.body);
	var passwordArray = req.body.password;
	
	//console.log(req.session.user.password)
	if (md5(md5(passwordArray[0])) === req.session.user.password) {
		if (md5(md5(passwordArray[1])) === md5(md5(passwordArray[2]))) {
			req.session.user.password = md5(md5(passwordArray[1]));
			User.findByIdAndUpdate(req.session.user._id, {
				password: md5(md5(passwordArray[1]))
			}, function(err, ret) {
				if (err) return console.error(err);
			})
			
			res.send({
				message: 'change the password already!'
			})
		}
		else {
			res.send({
				message: 'passwords are not the same!'
			})
		}
	}
	else {
		res.send({
			message: 'wrong password!'
		})
	}
});

//delete
router.post('/setting/delete', function (req, res) {
	//console.log(req.body);
	if (req.session.user.avatar != '../public/img/profile.jpg') {
		let path = req.session.user.avatar;
		let len = path.length;
		
		// path should be ./public/img/xxx
		fs.unlink(path.slice(1, len), function (err) {
			if (err) return console.error(err);
		})
	}
	
	User.remove({
		nickName: req.session.user.nickName
	}, function (err, ret) {
		if (err) return console.error(err);
		// console.log('deleted');
		// console.log('deletes');
		
		req.session.user = null;
		//!! ajax can not redirect 
		//res.redirect('/');
		res.send({
			message: 'deleted successfully! Thanks for using'
		})
	})
})

module.exports = router;
