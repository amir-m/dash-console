
var crypto = require('crypto'),
	async = require('async'),
	bcrypt = require('bcrypt'),
	token = 'NTmnGIkjStT2',
	cookieMaxAge = 90 * 24 * 60 * 60 * 1000, // 90 days
	cookieDictionary = {}, 
	models, notifications;


exports.init = function(m, n) {
	models = m;
	notifications = n;
};

exports.index = function(req, res, next) {
	res.render('index.html');
};


exports.postLogin = function(req, res, next) {
	res.send(401);
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
		}
	], 
	function(error, user){
		
		if (error == 409) return res.send(409);

		if (error) {
			res.send(500);
			throw error;
		}
		res.send(user.json());
		notifications.userSignUp(models.decipher(user.email), user.confirmation_id);
	});
};

exports.getVerifyEmail = function(req, res, next) {
	models.BenchUser.findOne({ confirmation_id: req.params.id }, function(error, user) {
		if (error) {
			res.send(500);
			throw error;
		}

		if (!user) return res.send(400);

		user.confirmed = true;
		user.confirmed_at = new Date();
		user.save(function(error){

			if (error) throw error;

			res.redirect('/');
		})
	});
};

exports.getLast = function(req, res, next) {
	res.redirect('/#/' + req.params.else);
};