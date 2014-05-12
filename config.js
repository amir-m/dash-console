module.exports = function (app, express, redisClient) {

	var session = require('express-session'),
		RedisStore = require('connect-redis')(session),
		connect = require('connect'),
		flash = require('connect-flash'),
		sessionStore = new RedisStore({ client: redisClient });

	app.set('views', __dirname + '/app');
	app.use(require('body-parser')());
	app.use(require('method-override')());
	app.use(require('morgan')('dev'));
	app.use(require('cookie-parser')());
	app.use(session({ 
		store: sessionStore, 
		key: 'sid',
		secret: 'the great key for eveything', // process.ENV.sid_secrect
		cookie: {
			maxAge: 20 * 60 * 1000,
			httpOnly: true
		} 
	}));
	app.use(express.static(__dirname + '/app'));
	app.engine('html', require('ejs').renderFile);
	
};
