var express = require("express"),
	app = express(),
	cluster = require('cluster'), 
	cpuCount = require('os').cpus().length,
	server = require('http').createServer(app),
	models = require('./models'),
	notifications = require('./notifications');

models.ready(function(){
	notifications.setModel(models);
	require('./config')(app, express, models);
	require('./router')(app, models, notifications);

	// models.User.find({}, function(error, users){
	// 	for (var i = 0; i < users.length; ++i) {
			// require('./graph').deleteEverything(function(data){
			// 	console.log(data);
			// });
	// 	}
	// });

});

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log("Listening on " + port);
});
