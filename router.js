module.exports = function (app, models, notifications, redisClient) {

	var routes = require('./routes');
	routes.init(models, notifications, redisClient);

	app.get('/', routes.index);
	app.post('/login', routes.postLogin);
	app.put('/user', routes.putUser);
	app.get('/dashname/exist/:name', routes.getDashnameExist);
	app.put('/dash', routes.putDash);

	// app.get('/search/users', routes.getSearchUsers);
	// app.get('/search/channels', routes.getSearchChannels);
	// app.get('/search/posts', routes.getSearchPosts);

	// app.delete('/post/like/:post_id', routes.deletePostLike);
	// app.delete('/post/dislike/:post_id', routes.deletePostDisLike);
	// app.put('/exit', routes.putExit);

	app.get('/:else', routes.getLast);
};