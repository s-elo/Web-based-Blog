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
	
	// gender setting
	req.session.user.gender = data.gender;
	User.findByIdAndUpdate(req.session.user._id, {
		gender: data.gender
	}, function(err, ret) {
		if (err) return console.error(err);
	})
	
	// nickname setting
	if (data.nickName != '') {
		req.session.user.nickName = data.nickName;
		User.findByIdAndUpdate(req.session.user._id, {
			nickName: data.nickName
		}, function(err, ret) {
			if (err) return console.error(err);
		})
	}
	
	// introduction setting
	if (data.bio != '') {
		req.session.user.bio = data.bio;
		User.findByIdAndUpdate(req.session.user._id, {
			bio: data.bio
		}, function(err, ret) {
			if (err) return console.error(err);
		})
	}
	
	// birthday setting
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
	let password = req.body.password;
	let newPassword = req.body.newPassword;

	// console.log(passwordArray[0]);
	// console.log(req.session.user.password);
	// console.log(md5(md5(passwordArray[0])));

	if (md5(md5(password)) === req.session.user.password) {
		User.findByIdAndUpdate(req.session.user._id, {
				password: md5(md5(newPassword))
			}, function(err, ret) {
				if (err) return console.error(err);
			})
			
			res.send({
				// to check if it is wrong
				code: 1,
				message: 'change the password already!'
			})
		// if (md5(md5(passwordArray[1])) === md5(md5(passwordArray[2]))) {
		// 	req.session.user.password = md5(md5(passwordArray[1]));
			
		// }
		// else {
		// 	res.send({
		// 		message: 'passwords are not the same!'
		// 	})
		// }
	}
	else {
		res.send({
			code: 0,
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
