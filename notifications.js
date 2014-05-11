var models;

var emails = {
		dashbench: '<do-not-reply@dashbookapp.com>'
	}, 
	from = {
		dashbench: 'Dashbench <do-not-reply@dashbookapp.com>'
	}, 
	text = {
		userSignUp: 'Hello and welcome to Dashbench. Please confirm your email address here:'
	}, 
	subject = {
		userSignUp: 'Welcome to Dashbench'
	}, 
	api_key = 'key-5scss5xcode4v-uwoq0s44szw2zlp-q1',
	domain = 'dashbookapp.com',
	Mailgun = require('mailgun-js'),
	mailgun = new Mailgun({apiKey: api_key, domain: domain});


exports.setModel = function(m) {
	models = m;
};

exports.userSignUp = function(email, confirmation) {

	confirmation = '<a href="http://localhost:8080/verify/email/'+confirmation+'">Verify Your Email</a>';

	var data = {
	  from: from.dashbench,
	  to: email,
	  subject: subject.userSignUp, 
	  html: 'Hello and welcome to Dashbench. Please confirm your email address here:\n' + confirmation,
	  text: text.userSignUp
	};

	mailgun.messages().send(data, function (error, body) {
		if (error) throw error;
		console.log(body);
	});

};