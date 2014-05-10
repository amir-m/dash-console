var express = require("express");
 
var app = express();
// app.use(express.logger());

// Configuration

app.set('views', __dirname + '/app');
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('morgan')('dev'));
app.use(express.static(__dirname + '/app'));
app.engine('html', require('ejs').renderFile);

app.get('/', function(request, response) {
  response.render('index.html')
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
