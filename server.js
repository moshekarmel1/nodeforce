var express = require('express'),
	routes = require('./routes'),
	jsforce = require('jsforce'),
    https = require('https'),
	url = require('url');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
/**
 * Setup some environment variables (heroku) with defaults if not present
 */
var port = process.env.PORT || 3000; // use heroku's dynamic port or 3000 if localhost
var csecr = process.env.CLIENT_SECRET;
/**
 * Create the server
 */
var app = express();
/**
 * Configuration the server
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({ 
	resave: true,
    saveUninitialized: true,
    secret: csecr 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/', routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});
//set up https
/*https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(port);*/
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
