const express = require('express');
const path = require('path');
const temp = require('art-template');
const bodyParser = require('body-parser');
const session = require('express-session');

const sessionRouter = require('./routers/session.js');
const settingRouter = require('./routers/setting.js');
const commentRouter = require('./routers/comment.js');

const app = express();

/**
 * __dirname: current absolute dir path
 * __filename: current absolute file path
 */
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));

app.engine('html', require('express-art-template'));

//views dir is the default dir
app.set('views', path.join(__dirname, './views/'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * after this, we can use req.session.(data) to add the data
 * req.session is obj, it can be added any data use .
 */
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(sessionRouter);
app.use(settingRouter);
app.use(commentRouter);

app.listen(3000, function() {
	console.log('running at port 3000....');
})

