
var crypto = require('crypto'),
	async = require('async'),
	bcrypt = require('bcrypt'),
	cookieMaxAge = 90 * 24 * 60 * 60 * 1000, // 90 days
	cookieDictionary = {}, 
	cookie_token = 'NtRdfc&gffR^78Sw#',
	models, notifications, redisClient;


exports.init = function(m, n, r) {
	models = m;
	notifications = n;
	redisClient = r;
};

exports.index = function(req, res, next) {
	res.render('index.html');
};


exports.postLogin = function(req, res){


	// SECURITY TODO: remove this code and make it more secure...)

	if (req.session && req.session.user_id) {
		
		models.BenchUser.find({ id: req.session.user_id })
		.exec(function(error, user){
			// TODO: handle error

			if (error) throw error;

			var user = (user && user.length > 0 ? user[0] : null) ;

			if (user) {
				res.send(user.json());
			}
			else {
				// SECURITY TODO: req.session contains a user_id could not be found!
				// if (req.cookies && req.cookies[token]) {
				// 	res.clearCookie(token, { path:'/' });
				// }
				req.session.destroy(function(error) {
					// TODO: handle error
					return res.send(401);
				});
			}
		});
	}
	else if (req.cookies && req.cookies[cookie_token]) {
		models.BenchUser.findUserFromSession(req.cookies[cookie_token], function(error, user){

			if (error) return res.send(error);

			console.log(user);

			if (!user || user.length == 0) {
				models.destroySession(req.cookies[cookie_token]);
				res.clearCookie(cookie_token, { path:'/' });
				return res.send(401);
			}

			return res.send(user[0].json());
		});
	}
	else if (req.body.email && req.body.password) {
		
		var email = models.cipher(req.body.email);

		models.BenchUser.find({ email: email })
		.exec(function (error, user) {

			// TODO: handle error

			if (!user || user.length == 0) {
				return res.send(401);
			}
			user = user[0];
			bcrypt.compare(req.body.password, user.password, function(error, result) {
				
				// TODO: handle error

				if (!result) {
					return res.send(401);
				}
				
				var id = models.cipher(user.id);
				models.createSession(id, user.json(), req.ip, req.headers['user-agent']);
				res.cookie(cookie_token, id, { maxAge: cookieMaxAge, httpOnly: true });
				req.session['user_id'] = user.id;
				res.send(user.json());
			});
		});
	}
	else {
		res.send(400);
	}
};

exports.getCheckUserExist = function(req, res, next) {
	console.log(req.params.email);
	console.log(models.cipher(req.params.email));
	res.send(200);
};

exports.putUser = function(req, res, next) {

	if (!req.body.email || !req.body.password || !req.body.name) return res.send(400);
	
	var email = models.cipher(req.body.email);

	async.waterfall([
		function(callback) {
			models.BenchUser.findOne({ email: email }, function(error, user) {
				if (error) return callback(error);

				if (user) return callback(409);

				callback();
			});

		},
		function(callback) {
			bcrypt.genSalt(10, function(error, salt) {
				callback(error, salt);
			});
		},
		function(salt, callback) {
			bcrypt.hash(req.body.password, salt, function(error, hash) {
				// hash = hash.substr(7, hash.length);
				callback(error, hash);
			});
		},
		function(pass, callback) {
			var u = new models.BenchUser({
				id: models.id(),
				confirmation_id: models.id(),
				name: req.body.name,
				email: email,
				password: pass,
				created_at: new Date()
			});
			u.save(function(error){
				callback(error, u);
			});
		},
		function(user, callback) {
			var id = models.cipher(user.id);
			notifications.userSignUp(models.decipher(user.email), user.confirmation_id);
			models.createSession(id, user.json(), req.ip, req.headers['user-agent']);
			callback(null, id, user);
		},
	], 
	function(error, id, user){
		
		if (error == 409) return res.send(409);

		if (error) {
			res.send(500);
			throw error;
		}

		res.cookie(cookie_token, id, { maxAge: cookieMaxAge, httpOnly: true })
		req.session['user_id'] = user.id;
		res.send(user.json());
		
	});
};

exports.getVerifyEmail = function(req, res, next) {
	models.BenchUser.findOne({ 
		confirmation_id: req.params.id, 
		confirmed: false 
	}, function(error, user) {
		if (error) {
			res.send(500);
			throw error;
		}

		if (!user) return res.send(400);

		user.confirmed = true;
		user.confirmed_at = new Date();

		user.save(function(error){

			if (error) throw error;

			req.session['user_id'] = user.id;
			res.cookie(cookie_token, models.cipher(user.id), { maxAge: cookieMaxAge, httpOnly: true })

			res.redirect('/');
		})
	});
};

exports.getLast = function(req, res, next) {
	res.redirect('/#/' + req.params.else);
};