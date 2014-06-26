Error.stackTraceLimit = Infinity;
var express = require("express"),
	app = express(),
	cluster = require('cluster'), 
	cpuCount = require('os').cpus().length,
	server = require('http').createServer(app),
	redis = require('redis'),
	redisClient = redis.createClient(6379, '54.185.233.146'),
	models = require('./models'),
	notifications = require('./notifications');

models.init(redisClient);

models.ready(function(){
	notifications.setModel(models);
	require('./config')(app, express, redisClient, models);
	require('./router')(app, models, notifications, redisClient);

	// models.User.find({}, function(error, users){
	// 	for (var i = 0; i < users.length; ++i) {
			// require('./graph').deleteEverything(function(data){
			// 	console.log(data);
			// });
	// 	}
	// });

});

// redisClient.keys("*", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     redisClient.quit();
// });

// redisClient.flushall(function (err, replies) {
//     console.log(replies);
// });

var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("Listening on " + port);
});
