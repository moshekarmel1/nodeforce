
/**
 * Module dependencies.
 */
var express = require('express'),
	routes = require('./routes'),
	jsforce = require('jsforce'),
	url = require('url');
var session = require('express-session');

/**
 * Setup some environment variables (heroku) with defaults if not present
 */
var port = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
var cid = process.env.CLIENT_ID || "YOUR-REMOTE-ACCESS-CONSUMER-KEY";
var csecr = process.env.CLIENT_SECRET || "YOUR-REMOTE-ACCESS-CONSUMER-SECRET";
var lserv = process.env.LOGIN_SERVER || "https://test.salesforce.com";
var redir = process.env.REDIRECT_URI || "http://localhost:" + port + "/token";
// Salesforce OAuth2 client information
var oauth2 = new jsforce.OAuth2({
	loginUrl : 'https://test.salesforce.com',
    clientId: cid,
    clientSecret: csecr,
    redirectUri: 'http://localhost:3000/oauth/callback'
});
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
app.use(express.static(__dirname + '/public'));

/**
 * Routes
 */

 // 'home' page
//app.get('/', routes.index);

app.get('/', function(req, res){
	if(!req.session){
		res.redirect('/oauth/auth');
	}else{
		res.render('index', { title: 'Salesforce.com Node.js REST Demo' })
	}
});

/* SF OAuth request, redirect to SF login */
app.get('/oauth/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web'}));
});

/* OAuth callback from SF, pass received auth code and get access token */
app.get('/oauth/callback', function(req, res) {
    var conn = new jsforce.Connection({oauth2: oauth2});
    var code = req.query.code;
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error(err); }

        console.log('Access Token: ' + conn.accessToken);
        console.log('Instance URL: ' + conn.instanceUrl);
        console.log('User ID: ' + userInfo.id);
        console.log('Org ID: ' + userInfo.organizationId);

        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        res.redirect('/');
    });
});

app.get('/accounts', function(req, res) {
    // if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }

    var query = 'SELECT id, name FROM account LIMIT 10';
    // open connection with client's stored OAuth details
    var conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    conn.query(query, function(err, result) {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        console.log(result);
    });
});

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
