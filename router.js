module.exports = function (app, models, notifications, redisClient) {

	var routes = require('./routes');
	routes.init(models, notifications, redisClient);

	app.get('/', routes.index);
	app.get('/dashname/exist/:name', routes.getDashnameExist);
	app.get('/verify/email/:id', routes.getVerifyEmail);

	app.post('/login', routes.postLogin);
	app.post('/logout', routes.postLogout);

	app.put('/user', routes.putUser);
	app.put('/dash', routes.putDash);

	// app.get('/search/users', routes.getSearchUsers);
	// app.get('/search/channels', routes.getSearchChannels);
	// app.get('/search/posts', routes.getSearchPosts);

	// app.delete('/post/like/:post_id', routes.deletePostLike);
	// app.delete('/post/dislike/:post_id', routes.deletePostDisLike);
	// app.put('/exit', routes.putExit);
	
	app.get('/health', function(req, res){
		return res.send(200);
	});

	app.get('/:else', routes.getLast);

};