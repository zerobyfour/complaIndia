
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , index = require('./routes/index')
  , comp = require('./routes/complain')
  , reqAd = require('./routes/reqAd')
  , awsS3 = require('./routes/awsS3')
  , http = require('http')
  , path = require('path')
  , config = require('./config/config-'+(process.env.ENV || 'dev')+'.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/complain');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
	console.log("yay!");
});
var app = express();

// all environments
app.set('port', process.env.PORT || config.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.compress());
var oneDay = 86400000;
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Make our db accessible to our router
app.use(function(req,res,next){
	console.log("setting db")
    req.db = db;
    next();
});

app.get('/', routes.index);
app.get('/complains', comp.complain);
app.post('/complains', comp.addComplain);
app.get('/complains/count', comp.complainCount);
app.get('/comments', comp.comment);
app.post('/comments', comp.addComment);
app.get('/comments/count', comp.commentCount);
app.get('/requests', reqAd.request);
app.post('/requests', reqAd.addRequest);
app.get('/requests/count', reqAd.requestCount);
app.get('/adverts', reqAd.advert);
app.post('/adverts', reqAd.addAdvert);
app.get('/adverts/count', reqAd.advertCount);
app.put('/aws/object', awsS3.putObject);
app.get('/aws/object/url', awsS3.getSignedUrl);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
