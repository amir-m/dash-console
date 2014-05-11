module.exports = function (app, express) {

	app.set('views', __dirname + '/app');
	app.use(require('body-parser')());
	app.use(require('method-override')());
	app.use(require('morgan')('dev'));
	app.use(express.static(__dirname + '/app'));
	app.engine('html', require('ejs').renderFile);
	
};
