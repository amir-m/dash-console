module.exports = function (app, models, notifications, redisClient) {

	var routes = require('./routes');
	routes.init(models, notifications, redisClient);

	app.get('/', routes.index);
	app.get('/verify/email/:id', routes.getVerifyEmail);
	app.get('/dashname/exist/:name', routes.getDashnameExist);
	app.post('/login', routes.postLogin);
	app.put('/user', routes.putUser);
	app.put('/dash', routes.putDash);

	app.get('/:else', routes.getLast);
};