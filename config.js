module.exports = function (app, express, redisClient, models) {

	var session = require('express-session'),
		RedisStore = require('connect-redis')(session),
		connect = require('connect'),
		flash = require('connect-flash'),
		sessionStore = new RedisStore({ client: redisClient }),
			cookieMaxAge = 90 * 24 * 60 * 60 * 1000, // 90 days
		sessionMaxAge = 20 * 60 * 1000,
		cookie_token = 'NtRdfc&gffR^78Sw#';

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
			maxAge: sessionMaxAge,
			httpOnly: true
		} 
	}));
	app.use(express.static(__dirname + '/app'));
	app.engine('html', require('ejs').renderFile);

	app.use(function(req, res, next){
		
		if (req.path == '/login' 
			|| req.path == '/logout' 
			|| req.path == '/user'
			|| req.path == '/') 

			return next();

		if (req.session && req.session.user_id) {
			req.session.cookie.maxAge = sessionMaxAge;
			next();
		}
		else if (req.cookies && req.cookies[cookie_token]) {

			models.BenchUser.findUserFromSession(req.cookies[cookie_token], function(error, user){

				if (error) {
					res.send(error);
					throw error;
				}

				if (!user || user.length == 0) {
					models.destroySession(req.cookies[cookie_token]);
					res.clearCookie(cookie_token, { path:'/' });
					return res.send(401);
				}
				user = user[0];
				var id = models.cipher(user.id);
				res.cookie(cookie_token, id, { maxAge: cookieMaxAge, httpOnly: true });
				req.session['user_id'] = user.id;
				return next();
			});
		}
		else
			return next();
	});
};
