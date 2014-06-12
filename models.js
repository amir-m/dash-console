var connectionString = "mongodb://admin:IuT603JamshEqplE2N&0}x!@candidate.19.mongolayer.com:10061/dbk",
	mongoose = require('mongoose'),
	crypto = require('crypto'),
	bcrypt = require('bcrypt'),
	async = require('async'),
	redisClients;

exports.init = function (r) {
	
	redisClients = r;
};

exports.ready = function (callback) {
	
	mongoose.connect(connectionString, function(error){
		if (error) throw error;
		console.log('connected to mongoDB: %s', connectionString);
		callback(null);
	});
};

// var UserDashSchema = new mongoose.Schema({
// 	id: { type: String, required: true, unique: true },
// 	dash_id: String,
// 	user: { type: String, required: true },
// 	title: { type: String, required: true },
// 	location: String,
// 	description: String,
// 	credits: String,
// 	icon_large: String,
// 	icon_small: String,
// 	setting_type: String,
// 	selected_setting: String,
// 	selected_source_uri: String,
// 	handler_placeholder: String, 
// 	is_active: { type: Boolean, default: true },
// 	data_container: String, // 'body.shots'
// 	source_uri_scheme: String,
// 	selected_setting_uri_field: String,
// 	source_uri_keys: [],
// 	source_uri_values: [],
// 	settings: {},
// 	content_type: [],
// 	source_uri: [],
// 	mapper_key: [],
// 	mapper_value: [],
// 	mapper_static_key: [],
// 	mapper_static_value: [],
// 	has_settings: Boolean,
// 	collection_name: String
// });

var PrivateDashSchema = new mongoose.Schema({

	id: String,
	confirmation_id: String,
	
	dash_type: { type: String, default: 'privateDash'},
	dash_title: String,
	dash_type: String,
	data_container: String,
	source_uri: String,
	source_uri_scheme: String,
	selected_setting_uri_field: String,
	content_type: [],
	mapper_key: [],
	mapper_value: [],
	has_settings: { type: Boolean, default: false },
	source_uri_keys: [],
	source_uri_values: [],
	settings: {},
	content_type: [],
	source_uri: [],
	mapper_key: [],
	mapper_value: [],
	mapper_static_key: [],
	mapper_static_value: [],

	user_id: String,
	user_name: String,
	user_email: String,

	view_count: { type: Number, default: 0 },
	add_count: { type: Number, default: 0 },

	confirmed: { type: Boolean, default: false },
	created_at: Date,
	confirmed_at: Date
});

PrivateDashSchema.methods.json = function(pass) {
	var u = this.toObject();
	delete u['_id'];
	delete u['__v'];
	delete u['confirmation_id'];
	delete u['user_name'];
	delete u['user_email'];
	return u;
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
	private_dashes_left: { type: Number, default: 1 },
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
	return u;
};

BenchUserSchema.statics.findUserFromSession = function(session_id, callback) {
	
	var self = this;

	redisClients.hgetall('session:'+session_id, function(error, session){
		// console.log(session);
		// callback(null, session);
		if (!session) return callback(401);

		session.updated_at = (new Date().getTime()).toString();

		redisClients.hmset("session:"+session_id, session);

		return self.where('id', session.user_id).exec(callback);
		// todo... update
	});
}

BenchUserSchema.set('toObject', { virtuals: true });
PrivateDashSchema.set('toObject', { virtuals: true });

var BenchUser = mongoose.model('BenchUser', BenchUserSchema);
var PrivateDash = mongoose.model('PrivateDash', PrivateDashSchema);

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

function createSession (session_id, user, ip, agent) {

	redisClients.hmset("session:"+session_id, {
		'id': session_id, 
		'user_id': user.id,
		'is_active': 'yes',
		'ip': ip,
		'user_agent': agent,
		'created_at': (new Date().getTime()).toString(),
		'updated_at': (new Date().getTime()).toString() 
	});
};

function destroySession (session_id) {

	redisClients.del("session:"+session_id);
};

function getSession (session_id, callback) {
	redisClients.hgetall("session:"+session_id, callback);
};

function getAndUpdateSession (session_id, callback) {
	redisClients.hgetall('sessions:'+session_id, function(error, session){
		callback(session);
		// todo... update
	});
};

function destroySession (session_id) {

	redisClients.del("session:"+session_id);
};

exports.BenchUser = BenchUser;
exports.PrivateDash = PrivateDash;
exports.cipher = cipher;
exports.decipher = decipher;
exports.id = _objectId;
exports.getSession = getSession;
exports.createSession = createSession;
exports.getAndUpdateSession = getAndUpdateSession;
exports.destroySession = destroySession;