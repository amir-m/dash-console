var connectionString = "mongodb://admin:IuT603JamshEqplE2N&0}x!@candidate.19.mongolayer.com:10061/dbk",
	mongoose = require('mongoose'),
	crypto = require('crypto'),
	bcrypt = require('bcrypt'),
	async = require('async');

 
exports.ready = function (callback) {
	
	mongoose.connect(connectionString, function(error){
		if (error) throw error;
		console.log('connected to mongoDB: %s', connectionString);
		callback(null);
	});
};

var BenchUserSchema = new mongoose.Schema({
	id: String,
	confirmation_id: String,
	name: String,
	email: String,
	password: String,
	dashes: [],
	settings: {},
	dash_count: { type: Number, default: 0 },
	confirmed: { type: Boolean, default: false },
	created_at: Date,
	confirmed_at: Date
});

BenchUserSchema.methods.comparePassword = function(pass) {
	bcrypt.compare(pass, this.password, function(error, res) {

		if (error) throw error;

		return res;
	});
};

BenchUserSchema.methods.json = function(pass) {
	var u = this.toObject();
	delete u['_id'];
	delete u['__v'];
	delete u['confirmation_id'];
	delete u['password'];
	delete u['email'];
	return u
};

BenchUserSchema.set('toObject', { virtuals: true });

var BenchUser = mongoose.model('BenchUser', BenchUserSchema);

function cipher (text) {	
	// change the key
	var key = 'NmU5MTgzYzJhNjM1N2JkZjhhMjAxZDc5OWM0ODFlZDYzMTYxNmQ3Ng';

	var cipher = crypto.createCipher('aes-256-cbc', key);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;		
}

function decipher(text){
	var key = 'NmU5MTgzYzJhNjM1N2JkZjhhMjAxZDc5OWM0ODFlZDYzMTYxNmQ3Ng';
	var decipher = crypto.createDecipher('aes-256-cbc', key)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}

var _objectId = function() {
	var id = (new mongoose.Types.ObjectId).toString();
	id = crypto.createHash('sha1').update(id).digest('hex');
	return (new Buffer(id).toString('base64').replace(/=/g, ""));
};

exports.BenchUser = BenchUser;
exports.cipher = cipher;
exports.decipher = decipher;
exports.id = _objectId;