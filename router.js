module.exports = function (app, models, notifications) {

	var routes = require('./routes');
	routes.init(models, notifications);

	app.get('/', routes.index);
	app.post('/login', routes.postLogin);
	app.get('/check/:email/exist', routes.getCheckUserExist);
	app.put('/user', routes.putUser);
	app.get('/verify/email/:id', routes.getVerifyEmail);

	// app.get('/search/users', routes.getSearchUsers);
	// app.get('/search/channels', routes.getSearchChannels);
	// app.get('/search/posts', routes.getSearchPosts);

	// app.delete('/post/like/:post_id', routes.deletePostLike);
	// app.delete('/post/dislike/:post_id', routes.deletePostDisLike);
	// app.put('/exit', routes.putExit);

	app.get('/:else', routes.getLast);
};