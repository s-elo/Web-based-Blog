const express = require('express');
const User = require('../models/user.js');
const md5 = require('blueimp-md5');

const router = express.Router();

//settings
router.get('/settings/basicInfo', function(req, res) {
	res.render('settings/basicInfo.html');
});

router.post('/settings/basicInfo', function(req, res) {
	console.log(req.body);
});

router.get('/settings/accountSetting', function(req, res) {
	res.render('settings/accountSetting.html');
});

router.post('/settings/accountSetting', function(req, res) {
	console.log(req.body);
});

module.exports = router;
